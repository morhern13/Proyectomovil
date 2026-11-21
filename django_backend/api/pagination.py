from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class LaravelStylePagination(PageNumberPagination):
    page_size_query_param = "per_page"
    max_page_size = 1000

    def get_paginated_response(self, data):
        page_size = self.get_page_size(self.request)
        metadata = {
            "current_page": self.page.number,
            "last_page": self.page.paginator.num_pages,
            "per_page": page_size,
            "total": self.page.paginator.count,
        }
        return Response(
            {
                **metadata,
                "data": data,
                "meta": metadata,
            }
        )
