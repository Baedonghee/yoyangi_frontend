import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMemberActions from 'actions/member-actions';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { memberListSelector, memberPageSelector } from 'stores/member';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/common';
import { IMemberQuery } from 'types/member';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { calculateSequence } from 'utils/paging';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Pagination from 'components/UI/Pagination';
import Select from 'components/UI/Select';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  .my-table {
    .image-td {
      img {
        width: 50px;
        border-radius: 50%;
        margin: 8px;
      }
    }
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

const memberStatus = [
  {
    value: 'Y',
    name: '진행',
  },
  {
    value: 'N',
    name: '탈퇴',
  },
];

interface IFormValues {
  name: string;
  email: string;
  valid: IOption | null;
}

const MemberList = () => {
  const list = useRecoilValue(memberListSelector);
  const page = useRecoilValue(memberPageSelector);
  const { getMembers, deleteMember } = useMemberActions();
  const { handleShowAlert, handleClose } = useAlert();
  const { register, watch, setValue, handleSubmit } = useForm<IFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      valid: {
        value: '',
        name: '전체',
      },
    },
  });

  const { search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
    if (query.name) {
      setValue('name', query.name as string);
    } else {
      setValue('name', '');
    }
    if (query.email) {
      setValue('email', query.email as string);
    } else {
      setValue('email', '');
    }
    if (query.valid) {
      setValue('valid', memberStatus.find((status) => status.value === query.valid) || null);
    } else {
      setValue('valid', {
        value: '',
        name: '전체',
      });
    }
  }, [search]);

  const fetchMembers = async () => {
    try {
      await getMembers(query);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handleStatus = (option: IOption) => {
    setValue('valid', option);
  };

  const onSubmit = handleSubmit(({ email, name, valid }) => {
    const queryData = {
      ...query,
      page: 1,
    } as IMemberQuery;
    if (email) {
      queryData.email = email;
    }
    if (name) {
      queryData.name = name;
    }
    if (valid) {
      queryData.valid = String(valid.value);
    }
    navigate(`${PATH.MEMBER_LIST}?${qs.stringify(queryData)}`);
  });

  const handleDelete = (memberId: string) => {
    handleShowAlert({
      title: '알림',
      description: '정말 탈퇴처리 하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteMember(memberId);
          handleShowAlert({
            title: '알림',
            description: '탈퇴처리 되었습니다.',
            type: 'success',
            onClose: () => {
              handleClose();
              fetchMembers();
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
    });
  };

  return (
    <Container>
      <PageHeader title="회원 목록" />
      <Box mt="24px">
        <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
          검색
        </Typography>
        <Form title="검색" onSubmit={onSubmit}>
          <Box mt="16px" borderRadius="12px" border={`1px solid ${theme.color.gray300}`} p="24px">
            <Box display="flex" gap="12px">
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  이름
                </Typography>
                <Input {...register('name')} size="xs" width="100%" placeholder="이름을 입력해주세요" />
              </Box>
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  이메일
                </Typography>
                <Input {...register('email')} size="xs" width="100%" placeholder="이메일을 입력해주세요" />
              </Box>
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  가입상태
                </Typography>
                <Select
                  list={[{ value: '', name: '전체' }, ...memberStatus]}
                  size="xs"
                  placeholder="가입상태를 선택해주세요"
                  selectOption={watch('valid')}
                  onClick={handleStatus}
                />
              </Box>
            </Box>
            <Box mt="24px" display="flex" justifyContent="end">
              <Button size="xs" width="80px" variant="outline" mr="12px" onClick={() => navigate(PATH.MEMBER_LIST)}>
                초기화
              </Button>
              <Button size="xs" width="80px" type="submit">
                검색
              </Button>
            </Box>
          </Box>
        </Form>
      </Box>
      <Box display="flex" justifyContent="end" alignItems="center" mt="32px">
        <Link to={PATH.YOUTUBE_ADD}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="12px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>회원 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>이메일</th>
                <th>가입일</th>
                <th>가입상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {list.map((member, index) => (
                <tr key={member.memberId}>
                  <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                  <td>{member.profile.name}</td>
                  <td>{formatter.phoneNumberWithInputHyphens(member.profile.mobile)}</td>
                  <td>{member.email}</td>
                  <td>{member.createdAt}</td>
                  <td>{member.property.valid.code === 'Y' ? 'Y' : '탈퇴'}</td>
                  <td>
                    {member.property.valid.code === 'Y' && (
                      <Box d="flex" justifyContent="center">
                        <Button size="xs" width="100px" color="error" onClick={() => handleDelete(member.memberId)}>
                          탈퇴처리
                        </Button>
                      </Box>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
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

export default MemberList;
