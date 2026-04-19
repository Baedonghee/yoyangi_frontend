import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useYoutubeActions from 'actions/youtube-actions';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { isCustomError } from 'utils/error';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  padding-bottom: 100px;
`;

interface IFormValues {
  name: string;
  link: string;
}

const YoutubeAdd = () => {
  const { id } = useParams<{ id: string }>();
  const { addYoutube, getYoutube, editYoutube } = useYoutubeActions();
  const { handleShowAlert } = useAlert();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      link: '',
    },
  });

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      reset({
        name: '',
        link: '',
      });
    }
  }, [id]);

  const fetchDetail = async (youtubeId: string) => {
    try {
      const youtube = await getYoutube(youtubeId);
      reset({
        name: youtube.title,
        link: youtube.url,
      });
    } catch (err) {
      handleShowAlert({
        description: isCustomError(err),
        title: '유튜브 조회 실패',
        type: 'error',
        onClose: () => {
          navigate(PATH.YOUTUBE_LIST);
        },
      });
    }
  };

  const onSubmit = handleSubmit(async ({ link, name }) => {
    try {
      if (id) {
        await editYoutube(id, { url: link, title: name });
      } else {
        await addYoutube({ url: link, title: name });
      }
      handleShowAlert({
        description: id ? '유튜브가 수정되었습니다.' : '유튜브가 등록되었습니다.',
        title: id ? '유튜브 수정 성공' : '유튜브 등록 성공',
        type: 'success',
        onClose: () => {
          navigate(PATH.YOUTUBE_LIST);
        },
      });
    } catch (err) {
      handleShowAlert({
        description: isCustomError(err),
        title: '유튜브 등록 실패',
        type: 'error',
      });
    }
  });

  return (
    <Container>
      <PageHeader title={id ? '유튜브 수정' : '유튜브 등록'} />
      <Box mt="24px">
        <Form title="유튜브 등록" onSubmit={onSubmit}>
          <Box>
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              제목
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('name', {
                required: '제목을 입력해주세요',
              })}
              placeholder="제목을 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.name?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              링크
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('link', {
                required: '링크를 입력해주세요',
              })}
              placeholder="링크를 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              error={errors.link?.message}
            />
          </Box>
          <Button width="200px" type="submit" mt="16px" disabled={!isValid || isSubmitting}>
            {id ? '수정' : '등록'}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default YoutubeAdd;
