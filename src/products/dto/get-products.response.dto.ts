export class GetProductsResponseDto {
  data: any[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
