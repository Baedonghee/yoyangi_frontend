import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { bannerAtom } from 'stores/banner';
import { IBanner, IBannerDetail, IBannerForm, IBannerQuery } from 'types/banner';
import { IApi, IApiList } from 'types/common';
import axios from 'utils/axios';

function useBannerActions() {
  const setBanner = useSetRecoilState(bannerAtom);

  async function getBanners(queryForm: IBannerQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/app/banners?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IBanner[]>> = await axios.get(url);
      if (status === 200) {
        setBanner({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function addBanner(formData: IBannerForm) {
    try {
      const url = '/v1/app/banners';
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.post(url, formData);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editBanner(bannerId: string, formData: IBannerForm) {
    try {
      const url = `/v1/app/banners/${bannerId}`;
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.patch(url, formData);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteBanner(bannerId: string) {
    try {
      const url = `/v1/app/banners/${bannerId}`;
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.delete(url);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getBanner(bannerId: string) {
    try {
      const url = `/v1/app/banners/${bannerId}`;
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IBannerDetail>> = await axios.get(url);
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getBanners, addBanner, editBanner, deleteBanner, getBanner };
}

export default useBannerActions;
