import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import ModalLayout from 'components/common/ModalLayout';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Typography from 'components/UI/Typography';

const Container = styled.div``;

interface IReviewRejectModal {
  onClose: () => void;
  onComplete: (comment: string) => void;
}

interface IFormValues {
  comment: string;
}

const ReviewRejectModal: React.FC<IReviewRejectModal> = ({ onClose, onComplete }) => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = handleSubmit(({ comment }) => {
    onComplete(comment);
  });

  return (
    <ModalLayout title="리뷰 거절" width="400px" onClose={onClose}>
      <Container>
        <Form title="리뷰 거절" onSubmit={onSubmit}>
          <Typography fontSize={theme.fontSize.text16} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px" mt="24px">
            거절 사유
          </Typography>
          <Input
            {...register('comment', {
              required: '거절사유를 입력해주세요',
            })}
            placeholder="거절사유를 입력해주세요"
            size="xs"
            width="100%"
            error={errors.comment?.message}
          />
          <Box mt="24px" display="flex" justifyContent="center">
            <Button size="m" width="150px" variant="outline" mr="24px" onClick={onClose}>
              취소
            </Button>
            <Button size="m" width="150px" type="submit" disabled={!isValid || isSubmitting}>
              확인
            </Button>
          </Box>
        </Form>
      </Container>
    </ModalLayout>
  );
};

export default ReviewRejectModal;
