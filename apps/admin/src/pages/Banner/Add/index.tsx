import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useBannerActions from 'actions/banner-actions';
import { useCommonActions } from 'actions/common-actions';
import { format } from 'date-fns';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/common';
import { positionList } from 'utils/common';
import { isCustomError } from 'utils/error';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import CalendarIcon from 'components/SVG/icons/calendar-icon';
import CloseRound from 'components/SVG/icons/close-round';
import Plus from 'components/SVG/icons/plus';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Calendar from 'components/UI/Calendar';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Select from 'components/UI/Select';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  padding-bottom: 100px;
  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    cursor: pointer;
  }
`;

interface IFormValues {
  name: string;
  position: IOption | null;
  pcImageUrl: {
    id: string;
    name: string;
  } | null;
  mobileImageUrl: {
    id: string;
    name: string;
  } | null;
  link: string;
  startDate: Date | null;
  endDate: Date | null;
}

const BannerAdd = () => {
  const { fileUpload } = useCommonActions();
  const { addBanner, getBanner, editBanner } = useBannerActions();
  const { handleShowAlert } = useAlert();
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      position: null,
      pcImageUrl: null,
      mobileImageUrl: null,
      link: '',
      startDate: null,
      endDate: null,
    },
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const filePath = useRef<HTMLInputElement>(null);
  const mobileFilePath = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);

  register('position', { required: '위치를 선택해주세요' });
  register('pcImageUrl', { required: 'PC 이미지를 등록해주세요' });
  register('mobileImageUrl', { required: 'Mobile 이미지를 등록해주세요' });

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      reset({
        name: '',
        position: null,
        pcImageUrl: null,
        mobileImageUrl: null,
        link: '',
        startDate: null,
        endDate: null,
      });
    }
  }, [id]);

  const fetchDetail = async (bannerId: string) => {
    try {
      const detail = await getBanner(bannerId);
      reset({
        name: detail.title,
        position: {
          value: detail.location.code,
          name: detail.location.name,
        },
        pcImageUrl: {
          id: detail.pcImageUrl,
          name: detail.pcImageUrl,
        },
        mobileImageUrl: {
          id: detail.mobileImageUrl,
          name: detail.mobileImageUrl,
        },
        link: detail.linkUrl,
        startDate: new Date(detail.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        endDate: new Date(detail.endDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
      });
    } catch (error) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(error),
        type: 'error',
        onClose: () => navigate(PATH.BANNER_LIST),
      });
    }
  };

  const handlePositionChange = (option: IOption) => {
    setValue('position', option, { shouldValidate: true });
  };

  const handleFileClick = () => {
    if (filePath.current) {
      filePath.current.click();
    }
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 동작 방지
    setIsDragging(false);

    const files = e.dataTransfer.files; // 드래그한 파일들 가져오기
    if (files && files.length > 0) {
      handleFileChange({ files }); // 파일 처리 로직 호출
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | { files: FileList }) => {
    try {
      const fileInput = 'files' in e ? e : e.target;
      const file = fileInput.files && fileInput.files[0];
      if (file) {
        if (file.name.endsWith('.jpeg') || file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
          const fileId = await fileUpload('/v1/uploads/banner/images', file);
          if (fileId) {
            setValue(
              'pcImageUrl',
              {
                id: fileId,
                name: URL.createObjectURL(file),
              },
              { shouldValidate: true },
            );
          }
        } else {
          handleShowAlert({
            title: '알림',
            type: 'error',
            description: '이미지 파일만 업로드 가능합니다',
          });
        }
      }
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    } finally {
      if ('target' in e) {
        e.target.value = '';
      }
    }
  };

  const handleMobileFileClick = () => {
    if (mobileFilePath.current) {
      mobileFilePath.current.click();
    }
  };

  const handleMobileFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 기본 동작 방지
    setIsMobileDragging(false);

    const files = e.dataTransfer.files; // 드래그한 파일들 가져오기
    if (files && files.length > 0) {
      handleMobileFileChange({ files }); // 파일 처리 로직 호출
    }
  };

  const handleMobileDragEnter = () => {
    setIsMobileDragging(true);
  };

  const handleMoblieDragLeave = () => {
    setIsMobileDragging(false);
  };

  const handleMobileFileChange = async (e: React.ChangeEvent<HTMLInputElement> | { files: FileList }) => {
    try {
      const fileInput = 'files' in e ? e : e.target;
      const file = fileInput.files && fileInput.files[0];
      if (file) {
        if (file.name.endsWith('.jpeg') || file.name.endsWith('.jpg') || file.name.endsWith('.png')) {
          const fileId = await fileUpload('/v1/uploads/banner/images', file);
          if (fileId) {
            setValue(
              'mobileImageUrl',
              {
                id: fileId,
                name: URL.createObjectURL(file),
              },
              { shouldValidate: true },
            );
          }
        } else {
          handleShowAlert({
            title: '알림',
            type: 'error',
            description: '이미지 파일만 업로드 가능합니다',
          });
        }
      }
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    } finally {
      if ('target' in e) {
        e.target.value = '';
      }
    }
  };

  const handleStartCalendarOpen = () => {
    setOpenStartCalendar((prev) => !prev);
  };

  const handleStartDateClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id !== 'startDate') {
      setOpenStartCalendar(false);
    }
  };

  const handleStartSetDate = (date: Date) => {
    setValue('startDate', date, { shouldValidate: true });
    setOpenStartCalendar(false);
  };

  const handleEndCalendarOpen = () => {
    setOpenEndCalendar((prev) => !prev);
  };

  const handleEndDateClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id !== 'endDate') {
      setOpenEndCalendar(false);
    }
  };

  const handleEndSetDate = (date: Date) => {
    setValue('endDate', date, { shouldValidate: true });
    setOpenEndCalendar(false);
  };

  const handlePcImageRemove = () => {
    setValue('pcImageUrl', null, { shouldValidate: true });
  };

  const handleMobileImageRemove = () => {
    setValue('mobileImageUrl', null, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = {
        title: data.name,
        location: String(data.position!.value),
        pcFileId: data.pcImageUrl!.id.includes('http') ? null : data.pcImageUrl!.id,
        mobileFileId: data.mobileImageUrl!.id.includes('http') ? null : data.mobileImageUrl!.id,
        linkUrl: data.link,
        startDate: format(data.startDate!, 'yyyyMMdd'),
        endDate: format(data.endDate!, 'yyyyMMdd'),
      };
      if (id) {
        await editBanner(id, formData);
      } else {
        await addBanner(formData);
      }
      handleShowAlert({
        title: '알림',
        description: id ? '배너가 수정되었습니다.' : '배너가 등록되었습니다.',
        type: 'success',
        onClose: () => navigate(PATH.BANNER_LIST),
      });
    } catch (error) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(error),
        type: 'error',
      });
    }
  });

  return (
    <Container>
      <PageHeader title={id ? '배너 수정' : '배너 등록'} />
      <Box mt="24px">
        <Form title="배너 등록" onSubmit={onSubmit}>
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
              위치
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Select
              list={positionList}
              width="500px"
              mt="12px"
              size="xs"
              placeholder="위치를 선택해주세요"
              selectOption={watch('position')}
              onClick={handlePositionChange}
              error={errors.position?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              이미지 등록 (PC {watch('position') ? (watch('position')?.value === 'L1' ? '1920px x 557px' : '976px x 200px') : null})
              <Typography as="span" fontSize={theme.fontSize.text12} fontWeight={theme.fontWeight.normal} ml="16px">
                (JPG, JPEG, PNG 파일 업로드)
              </Typography>
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <input ref={filePath} style={{ display: 'none' }} onChange={handleFileChange} type="file" accept=".jpg,.jpeg,.png" />
            {watch('pcImageUrl') ? (
              <Box mt="12px" display="flex" alignItems="center" width="300px" position="relative">
                <div className="close-btn" onClick={handlePcImageRemove}>
                  <CloseRound width="24" height="24" color={theme.color.white} />
                </div>
                <img style={{ width: '300px' }} src={watch('pcImageUrl')!.name} />
              </Box>
            ) : (
              <Box
                mt="12px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="200px"
                height="200px"
                border="1px dashed"
                borderColor={theme.color.gray300}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop} // 드롭 이벤트 핸들러
                style={{
                  backgroundColor: isDragging ? theme.color.gray100 : 'transparent', // 드래그 중 시각 효과
                }}
                onDragEnter={handleDragEnter} // 드래그 시작
                onDragLeave={handleDragLeave} // 드래그 종료
                cursor="pointer"
                onClick={handleFileClick}
              >
                <Plus width="24" height="24" />
              </Box>
            )}
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              이미지 등록 (Mobile {watch('position') ? (watch('position')?.value === 'L2' ? '390px x 208px' : '390px x 100px') : null})
              <Typography as="span" fontSize={theme.fontSize.text12} fontWeight={theme.fontWeight.normal} ml="16px">
                (JPG, JPEG, PNG 파일 업로드)
              </Typography>
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <input ref={mobileFilePath} style={{ display: 'none' }} onChange={handleMobileFileChange} type="file" accept=".jpg,.jpeg,.png" />
            {watch('mobileImageUrl') ? (
              <Box mt="12px" display="flex" alignItems="center" width="300px" position="relative">
                <div className="close-btn" onClick={handleMobileImageRemove}>
                  <CloseRound width="24" height="24" color={theme.color.white} />
                </div>
                <img style={{ width: '300px' }} src={watch('mobileImageUrl')!.name} />
              </Box>
            ) : (
              <Box
                mt="12px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="200px"
                height="200px"
                border="1px dashed"
                borderColor={theme.color.gray300}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleMobileFileDrop} // 드롭 이벤트 핸들러
                style={{
                  backgroundColor: isMobileDragging ? theme.color.gray100 : 'transparent', // 드래그 중 시각 효과
                }}
                onDragEnter={handleMobileDragEnter} // 드래그 시작
                onDragLeave={handleMoblieDragLeave} // 드래그 종료
                cursor="pointer"
                onClick={handleMobileFileClick}
              >
                <Plus width="24" height="24" />
              </Box>
            )}
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
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              노출기간
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mt="12px">
              <Box position="relative">
                <Input
                  className="address-input"
                  {...register('startDate', {
                    required: '시작날짜를 선택해주세요',
                  })}
                  value={watch('startDate') ? format(watch('startDate')!, 'yyyy-MM-dd') : ''}
                  error={errors.startDate?.message}
                  onlyBorder
                  placeholder="시작날짜를 선택해주세요"
                  mt="8px"
                  width="100%"
                  size="xs"
                  readOnly
                  onClick={handleStartCalendarOpen}
                  iconAlign="left"
                  icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                />
                {openStartCalendar && (
                  <Box position="absolute" top="40px" left="0px">
                    <Calendar onCancel={handleStartDateClose} date={watch('startDate')} onConfirm={handleStartSetDate} />
                  </Box>
                )}
              </Box>
              <Typography fontSize={theme.fontSize.text16} m="0px 16px">
                ~
              </Typography>
              <Box position="relative">
                <Input
                  className="address-input"
                  {...register('endDate', {
                    required: '종료날짜를 선택해주세요',
                  })}
                  value={watch('endDate') ? format(watch('endDate')!, 'yyyy-MM-dd') : ''}
                  error={errors.endDate?.message}
                  onlyBorder
                  placeholder="종료날짜를 선택해주세요"
                  mt="8px"
                  width="100%"
                  size="xs"
                  readOnly
                  onClick={handleEndCalendarOpen}
                  iconAlign="left"
                  icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                />
                {openEndCalendar && (
                  <Box position="absolute" top="40px" left="0px">
                    <Calendar onCancel={handleEndDateClose} date={watch('endDate')} onConfirm={handleEndSetDate} />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Button width="200px" type="submit" mt="16px" disabled={!isValid || isSubmitting}>
            {id ? '수정' : '등록'}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default BannerAdd;
