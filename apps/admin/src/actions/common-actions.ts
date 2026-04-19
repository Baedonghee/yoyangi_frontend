import { AxiosResponse } from 'axios';
import { IApi, IApiList, IFileUpload, ILocation, IRegion } from 'types/common';
import axios from 'utils/axios';

function useCommonActions() {
  async function fileUpload(url: string, file: File) {
    try {
      const {
        data: { status, message, data },
      }: AxiosResponse<IApi<IFileUpload>> = await axios.post(
        url,
        {
          file,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (status === 200) {
        return data.fileId;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getLocation(search: string) {
    try {
      const url = `/v1/residences/location?query=${search}`;
      const {
        data: { status, data, message },
      }: AxiosResponse<IApi<ILocation>> = await axios.get(url);
      if (status === 200) {
        return data;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  async function getRegions() {
    try {
      const url = `/v1/app/regions`;
      const {
        data: { status, list, message },
      }: AxiosResponse<IApiList<IRegion[]>> = await axios.get(url);
      if (status === 200) {
        return list;
      } else {
        throw message;
      }
    } catch (err) {
      throw err;
    }
  }

  return { fileUpload, getLocation, getRegions };
}

export { useCommonActions };
