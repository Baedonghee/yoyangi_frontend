import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { memberAtom } from 'stores/member';
import { IApiList } from 'types/common';
import { IMember, IMemberQuery } from 'types/member';
import axios from 'utils/axios';

function useMemberActions() {
  const setMember = useSetRecoilState(memberAtom);

  async function getMembers(queryForm: IMemberQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/members?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IMember[]>> = await axios.get(url);
      if (status === 200) {
        setMember({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteMember(id: string) {
    try {
      const url = `/v1/members/${id}/invalid`;
      const {
        data: { status, message },
      } = await axios.patch(url);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getMembers, deleteMember };
}

export default useMemberActions;
