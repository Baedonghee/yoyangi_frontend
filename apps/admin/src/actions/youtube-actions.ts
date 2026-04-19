import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { youtubeAtom } from 'stores/youtube';
import { IApi, IApiList } from 'types/common';
import { IYoutube, IYoutubeDetail, IYoutubeForm, IYoutubeOrderForm, IYoutubeQuery } from 'types/youtube';
import axios from 'utils/axios';

function useYoutubeActions() {
  const setYoutube = useSetRecoilState(youtubeAtom);

  async function getYoutubes(queryForm: IYoutubeQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/youtubes?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IYoutube[]>> = await axios.get(url);
      if (status === 200) {
        setYoutube({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function addYoutube(form: IYoutubeForm) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.post('/v1/youtubes', form);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editYoutube(youtubeId: string, form: IYoutubeForm) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.patch(`/v1/youtubes/${youtubeId}`, form);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getYoutube(youtubeId: string) {
    try {
      const url = `/v1/youtubes/${youtubeId}`;
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IYoutubeDetail>> = await axios.get(url);
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editOrderYoutube(youtubeOrderForm: IYoutubeOrderForm[]) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.put('/v1/youtubes/order', { youtubes: youtubeOrderForm });
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteYoutube(youtubeId: string) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.delete(`/v1/youtubes/${youtubeId}`);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getYoutubes, addYoutube, getYoutube, editYoutube, editOrderYoutube, deleteYoutube };
}

export default useYoutubeActions;
