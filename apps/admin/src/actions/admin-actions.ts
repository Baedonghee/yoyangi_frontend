import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { adminAtom } from 'stores/admin';
import { IAdmin, IAdminDetail, IAdminForm } from 'types/admin';
import { IApi, IApiList, IPageQuery } from 'types/common';
import axios from 'utils/axios';

function useAdminActions() {
  const setAdmin = useSetRecoilState(adminAtom);

  async function getAdmins(queryForm: IPageQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/moderators?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IAdmin[]>> = await axios.get(url);
      if (status === 200) {
        setAdmin({ list, page });
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getAdmin(memberId: string) {
    try {
      const url = `/v1/moderators/${memberId}`;
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IAdminDetail>> = await axios.get(url);
      if (status === 200) {
        return data;
      }
      throw message;
    } catch (err) {
      throw err;
    }
  }

  async function editAdmin(memberId: string, form: IAdminForm) {
    try {
      const url = `/v1/moderators/${memberId}`;
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.patch(url, form);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteAdmin(memberId: string) {
    try {
      const url = `/v1/moderators/${memberId}`;
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

  async function addAdmin(form: IAdminForm) {
    try {
      const url = '/v1/moderators';
      const {
        data: { status, message },
      }: AxiosResponse<IApi> = await axios.post(url, form);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getAdmins, getAdmin, editAdmin, deleteAdmin, addAdmin };
}

export default useAdminActions;
