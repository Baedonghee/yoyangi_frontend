import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { reviewAtom } from 'stores/review';
import { IApiList, IPageQuery } from 'types/common';
import { IReview } from 'types/review';
import axios from 'utils/axios';

function useReviewActions() {
  const setReview = useSetRecoilState(reviewAtom);

  async function getReviews(queryForm: IPageQuery) {
    try {
      const query = {
        ...queryForm,
        page: queryForm.page || 1,
        size: 20,
      };
      const url = `/v1/reviews?${qs.stringify(query)}`;
      const {
        data: { status, message, list, page },
      }: AxiosResponse<IApiList<IReview[]>> = await axios.get(url);
      if (status === 200) {
        setReview({ list, page });
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function approveReview(id: string) {
    try {
      const url = `/v1/reviews/${id}/status/approved`;
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

  async function rejectReview(id: string, formData: { comment: string }) {
    try {
      const url = `/v1/reviews/${id}/status/rejected`;
      const {
        data: { status, message },
      } = await axios.patch(url, formData);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function deleteReview(id: string) {
    try {
      const url = `/v1/reviews/${id}`;
      const {
        data: { status, message },
      } = await axios.delete(url);
      if (status !== 200) {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { getReviews, approveReview, rejectReview, deleteReview };
}

export default useReviewActions;
