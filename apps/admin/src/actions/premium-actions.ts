import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { premiumAtom } from 'stores/premium';
import { IApi, IApiList } from 'types/common';
import { IPremium, IPremiumDetail, IPremiumForm, IPremiumQuery } from 'types/premium';
import axios from 'utils/axios';

function usePremiumActions() {
  const setPremium = useSetRecoilState(premiumAtom);

  async function getPremiums(queryForm: IPremiumQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/residences/plans?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IPremium[]>> = await axios.get(url);
      if (status === 200) {
        setPremium({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function addPremium(premiumForm: IPremiumForm) {
    try {
      const url = `/v1/residences/plans/${premiumForm.residenceId}`;
      const {
        data: { message, status },
      }: AxiosResponse<IApi> = await axios.post(url, premiumForm);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editPremium(premiumForm: IPremiumForm) {
    try {
      const url = `/v1/residences/plans/${premiumForm.residenceId}`;
      const {
        data: { message, status },
      }: AxiosResponse<IApi> = await axios.put(url, premiumForm);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function editPremiumValid(premiumId: string, valid: string) {
    try {
      const url = `/v1/residences/plans/${premiumId}/valid/${valid}`;
      const {
        data: { message, status },
      }: AxiosResponse<IApi> = await axios.patch(url);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deletePremium(premiumId: string) {
    try {
      const url = `/v1/residences/plans/${premiumId}`;
      const {
        data: { message, status },
      }: AxiosResponse<IApi> = await axios.delete(url);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getPremium(premiumId: string) {
    try {
      const url = `/v1/residences/plans/${premiumId}`;
      const {
        data: { status, data, message },
      }: AxiosResponse<IApi<IPremiumDetail>> = await axios.get(url);
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getPremiums, addPremium, editPremium, deletePremium, getPremium, editPremiumValid };
}

export default usePremiumActions;
