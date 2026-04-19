import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAdminActions from 'actions/admin-actions';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { adminListSelector, adminPageSelector } from 'stores/admin';
import styled from 'styled-components';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { calculateSequence } from 'utils/paging';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
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

const AdminList = () => {
  const list = useRecoilValue(adminListSelector);
  const page = useRecoilValue(adminPageSelector);
  const { getAdmins, deleteAdmin } = useAdminActions();
  const { handleShowAlert, handleClose } = useAlert();

  const { search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  useEffect(() => {
    fetchList();
  }, [search]);

  const fetchList = async () => {
    try {
      await getAdmins(query);
    } catch (error) {
      handleShowAlert({ description: isCustomError(error), title: '알림', type: 'error' });
    }
  };

  const handleDelete = (memberId: string) => {
    handleShowAlert({
      title: '알림',
      description: '관리자를 삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteAdmin(memberId);
          handleShowAlert({
            description: '관리자를 삭제하였습니다.',
            title: '알림',
            type: 'success',
            onClose: () => {
              handleClose();
              fetchList();
            },
          });
        } catch (error) {
          handleShowAlert({ description: isCustomError(error), title: '알림', type: 'error' });
        }
      },
    });
  };

  return (
    <Container>
      <PageHeader title="관리자 목록" />
      <Box display="flex" justifyContent="end" alignItems="center" mt="32px">
        <Link to={PATH.ADMIN_ADD}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>관리자 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>아이디</th>
                <th>직급</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>권한</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.memberId}>
                    <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                    <td>{item.email}</td>
                    <td>{item.profile.position}</td>
                    <td>{item.profile.name}</td>
                    <td>{formatter.phoneNumberWithInputHyphens(item.profile.mobile)}</td>
                    <td>{item.authorities.map((authority) => authority.name).join(',')}</td>
                    <td>{item.createdAt}</td>
                    <td>
                      <Box d="flex" justifyContent="space-between">
                        <Link to={PATH.ADMIN_EDIT.replace(':id', item.memberId)}>
                          <Button size="xs" width="90px" mr="8px" color="primary" variant="outline">
                            수정
                          </Button>
                        </Link>
                        <Button size="xs" width="90px" mr="8px" color="error" onClick={() => handleDelete(item.memberId)}>
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

export default AdminList;
