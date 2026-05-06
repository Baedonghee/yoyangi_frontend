import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useYoutubeActions from 'actions/youtube-actions';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { youtubeListSelector, youtubePageSelector } from 'stores/youtube';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IYoutube } from 'types/youtube';
import { isCustomError } from 'utils/error';
import { calculateSequence } from 'utils/paging';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import YoutubeOrder from 'components/Modal/YoutubeOrder';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import ModalContainer from 'components/UI/ModalContainer';
import Pagination from 'components/UI/Pagination';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  .my-table {
    th,
    td {
      &:nth-child(1) {
        width: 70px;
      }
      &:last-child {
        width: 200px;
      }
    }
  }
`;

interface IFormValues {
  title: string;
}

interface IYoutubeListProps {
  endpoint?: string;
  label?: string;
  listPath?: string;
  addPath?: string;
  editPath?: string;
}

const YoutubeList: React.FC<IYoutubeListProps> = ({
  endpoint,
  label = '요양이TV',
  listPath = PATH.YOUTUBE_LIST,
  addPath = PATH.YOUTUBE_ADD,
  editPath = PATH.YOUTUBE_EDIT,
}) => {
  const list = useRecoilValue(youtubeListSelector);
  const page = useRecoilValue(youtubePageSelector);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const { handleShowAlert, handleClose } = useAlert();
  const { getYoutubes, editOrderYoutube, deleteYoutube } = useYoutubeActions({ endpoint });
  const { register, setValue, handleSubmit } = useForm<IFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
    },
  });

  const { pathname, search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  const navigate = useNavigate();

  useEffect(() => {
    if (query.title) {
      setValue('title', query.title as string);
    } else {
      setValue('title', '');
    }
    fetchYoutubes();
  }, [pathname, search, endpoint]);

  const fetchYoutubes = async () => {
    try {
      await getYoutubes(query);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const onSubmit = handleSubmit(async ({ title }) => {
    navigate(`${listPath}?title=${title}`);
  });

  const handleOrderModalOpen = () => {
    setIsOrderOpen(true);
  };

  const handleOrderModalClose = () => {
    setIsOrderOpen(false);
  };

  const handleChangeOrder = async (list: IYoutube[]) => {
    try {
      const formData = list.map((item, index) => ({
        youtubeId: item.youtubeId,
        order: index + 1,
      }));
      await editOrderYoutube(formData);
      handleShowAlert({
        title: '알림',
        description: '순서가 변경되었습니다.',
        type: 'success',
        onClose: () => {
          handleOrderModalClose();
          handleClose();
          fetchYoutubes();
        },
      });
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handleDelete = (youtubeId: string) => {
    handleShowAlert({
      title: '알림',
      description: '삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteYoutube(youtubeId);
          handleShowAlert({
            title: '알림',
            description: '삭제되었습니다.',
            type: 'success',
            onClose: () => {
              fetchYoutubes();
            },
          });
        } catch (err) {
          handleShowAlert({
            title: '알림',
            description: isCustomError(err),
            type: 'error',
          });
        }
      },
      onClose: () => {
        handleClose();
      },
    });
  };

  const onReset = () => {
    navigate(listPath);
  };

  return (
    <Container>
      {isOrderOpen && (
        <ModalContainer onClose={handleOrderModalClose}>
          <YoutubeOrder endpoint={endpoint} label={label} onClose={handleOrderModalClose} handleChangeOrder={handleChangeOrder} />
        </ModalContainer>
      )}
      <PageHeader title={`${label} 목록`} />
      <Form title={`${label} 검색`} onSubmit={onSubmit}>
        <Box mt="24px">
          <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
            검색
          </Typography>
          <Box mt="16px" borderRadius="12px" border={`1px solid ${theme.color.gray300}`} p="24px">
            <Box display="flex" gap="12px">
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  제목
                </Typography>
                <Input {...register('title')} size="xs" width="100%" placeholder="제목을 입력해주세요" />
              </Box>
              <Box flex="1" />
              <Box flex="1" />
            </Box>
            <Box mt="24px" display="flex" justifyContent="end">
              <Button size="xs" width="80px" variant="outline" mr="12px" onClick={onReset}>
                초기화
              </Button>
              <Button size="xs" width="80px" type="submit">
                검색
              </Button>
            </Box>
          </Box>
        </Box>
      </Form>
      <Box display="flex" justifyContent="end" alignItems="center" mt="32px">
        <Button color="primary" size="xs" width="80px" mr="12px" onClick={handleOrderModalOpen}>
          순서변경
        </Button>
        <Link to={addPath}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>
            {label} 목록: {page?.totalItems}
          </Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>링크</th>
                <th>순서</th>
                <th>등록자</th>
                <th>등록일자</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={`youtube-${index}`}>
                    <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                    <td>{item.title}</td>
                    <td>{item.url}</td>
                    <td>{item.order}</td>
                    <td>{item.creator}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.status}</td>
                    <td>
                      <Box d="flex" justifyContent="space-between">
                        <Link to={editPath.replace(':id', item.youtubeId)}>
                          <Button size="xs" width="90px" mr="8px" color="primary" variant="outline">
                            수정
                          </Button>
                        </Link>
                        <Button size="xs" width="90px" mr="8px" color="error" onClick={() => handleDelete(item.youtubeId)}>
                          삭제
                        </Button>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </Box>
        {page && page.totalPages > 1 && (
          <Box mt="32px">
            <Pagination totalPage={page.totalPages} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default YoutubeList;
