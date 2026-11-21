import sqlite3
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from api.models import (
    Brand,
    Category,
    Company,
    Customer,
    InventoryMovement,
    Invoice,
    InvoiceItem,
    InvoicePayment,
    Product,
    ProductPrice,
    ProductVariant,
    Supplier,
    User,
)


LEGACY_TABLES = [
    ("companies", Company),
    ("users", User),
    ("brands", Brand),
    ("categories", Category),
    ("customers", Customer),
    ("suppliers", Supplier),
    ("products", Product),
    ("product_variants", ProductVariant),
    ("product_prices", ProductPrice),
    ("invoices", Invoice),
    ("invoice_items", InvoiceItem),
    ("invoice_payments", InvoicePayment),
    ("inventory_movements", InventoryMovement),
]


class Command(BaseCommand):
    help = "Importa los datos de una copia SQLite de Laravel sin copiar hashes de contraseña."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            default=str(Path(__file__).resolve().parents[4] / "backend" / "database" / "database.sqlite"),
            help="Ruta a la base SQLite del backend Laravel.",
        )

    def handle(self, *args, **options):
        source = Path(options["source"]).expanduser().resolve()
        if not source.is_file():
            raise CommandError(f"No existe la base de origen: {source}")
        if any(model.objects.exists() for _, model in LEGACY_TABLES):
            raise CommandError("La base Django ya contiene datos de negocio; importa solo en una base vacía.")

        connection = sqlite3.connect(str(source))
        connection.row_factory = sqlite3.Row
        imported = {}
        try:
            with transaction.atomic():
                tables = {
                    row["name"]
                    for row in connection.execute(
                        "SELECT name FROM sqlite_master WHERE type = 'table'"
                    )
                }
                for table, model in LEGACY_TABLES:
                    if table not in tables:
                        imported[table] = 0
                        continue
                    columns = {
                        row["name"] for row in connection.execute(f"PRAGMA table_info({table})")
                    }
                    fields = {
                        field.attname: field
                        for field in model._meta.concrete_fields
                        if field.attname in columns and field.attname not in {"password"}
                    }
                    records = []
                    for row in connection.execute(f"SELECT * FROM {table} ORDER BY id"):
                        values = {name: row[name] for name in fields}
                        if model is User:
                            values["password"] = "!"
                            values.setdefault("is_staff", False)
                            values.setdefault("is_superuser", False)
                            values["date_joined"] = timezone.now()
                            if "deleted_at" in columns and row["deleted_at"]:
                                values["is_active"] = False
                        records.append(model(**values))

                    if model is Category:
                        for record in records:
                            record.parent_id = None
                    model.objects.bulk_create(records, batch_size=500)
                    imported[table] = len(records)

                    if model is Category:
                        for row in connection.execute(
                            "SELECT id, parent_id FROM categories WHERE parent_id IS NOT NULL"
                        ):
                            Category.objects.filter(pk=row["id"]).update(parent_id=row["parent_id"])
        except sqlite3.Error as error:
            raise CommandError(f"No se pudo leer la base de origen: {error}") from error
        finally:
            connection.close()

        for table, count in imported.items():
            self.stdout.write(f"{table}: {count}")
        self.stdout.write(self.style.SUCCESS(
            "Importación terminada. Los usuarios deben restablecer sus contraseñas."
        ))
