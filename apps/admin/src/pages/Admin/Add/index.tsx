import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useAdminActions from 'actions/admin-actions';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/common';
import { authorityList, authoritySortList } from 'utils/common';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import CheckBox from 'components/UI/CheckBox';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  padding-bottom: 100px;
  ul.authority-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    li {
      margin-right: 12px;
    }
  }
`;

interface IFormValues {
  email: string;
  password: string;
  position: string;
  name: string;
  phone: string;
  authority: IOption[];
  memo: string;
}

const AdminAdd = () => {
  const { id } = useParams<{ id: string }>();
  const { handleShowAlert } = useAlert();
  const { addAdmin, getAdmin, editAdmin } = useAdminActions();
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      position: '',
      name: '',
      phone: '',
      authority: [],
      memo: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'authority',
  });

  const sortAuthorityList = authoritySortList.map((item) => authorityList.find((authority) => authority.name === item)).filter((item) => item);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      reset({
        email: '',
        password: '',
        position: '',
        name: '',
        phone: '',
        authority: [],
        memo: '',
      });
    }
  }, [id]);

  const fetchDetail = async (memberId: string) => {
    try {
      const data = await getAdmin(memberId);
      reset({
        email: data.email,
        password: '',
        position: data.profile.position,
        name: data.profile.name,
        phone: formatter.phoneNumberWithInputHyphens(data.profile.mobile),
        authority: data.authorities.map((authority) => ({ value: authority.code, name: authority.name })),
        memo: data.memo || '',
      });
    } catch (error) {
      handleShowAlert({ description: isCustomError(error), title: '알림', type: 'error' });
    }
  };

  const handleAuthorityChange = (item: IOption) => {
    const index = fields.findIndex((field) => field.value === item.value);
    if (index === -1) {
      append(item);
    } else {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async ({ authority, email, memo, name, password, phone, position }) => {
    try {
      const formData = {
        email,
        password: password || null,
        name,
        mobile: formatter.removePhoneNumberHyphens(phone),
        position,
        memo,
        authorities: authority.map((item) => String(item.value)),
      };
      if (id) {
        await editAdmin(id, formData);
      } else {
        await addAdmin(formData);
      }
      handleShowAlert({
        description: id ? '관리자가 수정되었습니다.' : '관리자가 등록되었습니다.',
        title: '알림',
        type: 'success',
        onClose: () => {
          navigate(PATH.ADMIN_LIST);
        },
      });
    } catch (err) {
      handleShowAlert({
        description: isCustomError(err),
        title: '알림',
        type: 'error',
      });
    }
  });

  return (
    <Container>
      <PageHeader title={id ? '관리자 수정' : '관리자 등록'} />
      <Box mt="24px">
        <Form title="관리자 등록" onSubmit={onSubmit}>
          <Box>
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              이메일
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('email', {
                required: '이메일을 입력해주세요',
              })}
              placeholder="이메일을 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.email?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              비밀번호
              {!id && (
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              )}
            </Box>
            <Input
              {...register('password', {
                required: id ? undefined : '비밀번호를 입력해주세요',
              })}
              placeholder="비밀번호를 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.password?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              직급
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('position', {
                required: '직급을 입력해주세요',
              })}
              placeholder="직급을 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.position?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              이름
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('name', {
                required: '이름을 입력해주세요',
              })}
              placeholder="이름을 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.name?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              휴대폰번호
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('phone', {
                required: '휴대폰번호를 입력해주세요',
              })}
              placeholder="휴대폰번호를 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.phone?.message}
              onChange={(e) => {
                const { onChange } = register('phone');
                const { phone } = getValues();
                if (e.target.value.length > 13) {
                  e.target.value = phone;
                  onChange(e);
                  return;
                }
                let selectStart = e.target.selectionStart;
                e.target.value = formatter.phoneNumberWithInputHyphens(e.target.value);
                selectStart = formatter.selectRange(e.target.value, phone, Number(selectStart));
                e.target.setSelectionRange(e.target.value.length, selectStart);
                onChange(e);
              }}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              권한
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <ul className="authority-list">
              {sortAuthorityList.map((item) => (
                <li key={item!.value}>
                  <CheckBox
                    name="useAgree"
                    checked={fields.some((authority) => authority.value === item!.value)}
                    width="16"
                    height="16"
                    onClick={() => handleAuthorityChange(item!)}
                  >
                    {item!.name}
                  </CheckBox>
                </li>
              ))}
            </ul>
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
              메모
            </Box>
            <Input {...register('memo')} placeholder="메모를 입력해주세요" size="xs" width="500px" mt="12px" error={errors.name?.message} />
          </Box>
          <Button width="200px" type="submit" mt="16px" disabled={!isValid || isSubmitting || fields.length < 1}>
            {id ? '수정' : '등록'}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default AdminAdd;
