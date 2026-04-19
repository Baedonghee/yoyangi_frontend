import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthActions from 'actions/auth-actions';
import { useMeActions } from 'actions/me-actions';
import { useAlert } from 'providers/alert.provider';
import { theme } from 'styles/theme';
import { isCustomError } from 'utils/error';
import { PATH } from 'utils/path';
import { validator } from 'utils/validator';

import EyeClose from 'components/SVG/icons/eye-close';
import EyeOpen from 'components/SVG/icons/eye-open';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

const AdminLogin: React.FC = () => {
  const { login } = useAuthActions();
  const { me } = useMeActions();
  const navigate = useNavigate();
  const { handleShowAlert } = useAlert();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    setFocus,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleVisible = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPasswordVisible(!isPasswordVisible);
    setTimeout(() => {
      setFocus('password');
    }, 0);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data);
      await me();
      navigate(PATH.MAIN);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  });

  return (
    <Box backgroundColor={theme.color.gray100} height="100%" display="flex">
      <Box width="384px" m="auto">
        <Box display="flex" justifyContent="center">
          <Typography fontSize={theme.fontSize.text32} fontWeight={theme.fontWeight.bold}>
            요양이 ADMIN
          </Typography>
        </Box>
        <Box as="form" mt="40px" p="40px 32px" backgroundColor={theme.color.white} borderRadius="12px" onSubmit={onSubmit}>
          <Typography as="h1" textAlign="center" fontSize={theme.fontSize.text24} fontWeight={theme.fontWeight.bold} color={theme.color.gray900}>
            관리자 로그인
          </Typography>
          <Box mt="32px">
            <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900}>
              아이디
            </Typography>
            <Input
              width="100%"
              name="email"
              type="email"
              mt="12px"
              register={register}
              size="m"
              options={{
                required: {
                  value: true,
                  message: '이메일을 입력해주세요',
                },
                pattern: {
                  value: validator.emailReg,
                  message: '이메일 형식이 올바르지 않습니다.',
                },
              }}
              placeholder="이메일을 입력해주세요"
            />
            <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900} mt="24px">
              비밀번호
            </Typography>
            <Input
              width="100%"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              mt="12px"
              register={register}
              size="m"
              options={{
                required: {
                  value: true,
                  message: '비밀번호를 입력해주세요',
                },
              }}
              placeholder="비밀번호를 입력해주세요"
              icon={
                isPasswordVisible ? (
                  <EyeClose width="20" height="20" color={theme.color.gray700} style={{ cursor: 'pointer' }} onClick={handleVisible} />
                ) : (
                  <EyeOpen width="20" height="20" color={theme.color.gray700} style={{ cursor: 'pointer' }} onClick={handleVisible} />
                )
              }
              iconAlign="right"
            />
            <Box mt="24px">
              <Button type="submit" width="100%" disabled={!isValid || isSubmitting}>
                로그인
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLogin;
