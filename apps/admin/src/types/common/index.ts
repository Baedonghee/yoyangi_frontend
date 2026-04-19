export interface IOption {
  value: string | number;
  name: string;
  icon?: React.ReactNode;
}

export interface ICode {
  code: string;
  name: string;
}

export interface IApi<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface IApiDataList<T = any, A = any> {
  status: number;
  message: string;
  data: T;
  list: A;
  count: number;
  page: IPage;
}

export interface IApiList<T = any> {
  status: number;
  message: string;
  list: T;
  count: number;
  page: IPage;
  data: any;
}

export interface IPage {
  offsetTime: number;
  size: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface IFileUpload {
  fileId: string;
}

export interface IPageQuery {
  page?: number;
  size?: number;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IRegionSub {
  regionId: string;
  name: string;
}

export interface IRegion {
  name: string;
  subs: IRegionSub[];
}
