import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { careAtom } from 'stores/care';
import { ICare, ICareDetail, ICareForm, ICareQuery, ICareTotal } from 'types/care';
import { IApi, IApiList } from 'types/common';
import axios from 'utils/axios';

function useCareActions() {
  const setCare = useSetRecoilState(careAtom);

  async function getCares(queryForm: ICareQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/residences?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<ICare[]>> = await axios.get(url);
      if (status === 200) {
        setCare({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getCare(residenceId: string) {
    try {
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<ICareDetail>> = await axios.get(`/v1/residences/${residenceId}`);
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function syncCares() {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.post('/v1/residences/ranking/sync');
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function addCare(care: ICareForm) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.post('/v1/residences', care);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editCare(residenceId: string, care: ICareForm) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.put(`/v1/residences/${residenceId}`, care);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteCare(residenceId: string) {
    try {
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.delete(`/v1/residences/${residenceId}`);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getCareTotal() {
    try {
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<ICareTotal>> = await axios.get('/v1/residences/count');
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getCares, getCare, syncCares, addCare, editCare, deleteCare, getCareTotal };
}

export default useCareActions;
