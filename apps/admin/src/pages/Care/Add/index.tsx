import React, { useEffect, useState } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useCareActions from 'actions/care-actions';
import { format } from 'date-fns';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { ICareForm } from 'types/care';
import { IOption } from 'types/common';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import CalendarIcon from 'components/SVG/icons/calendar-icon';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Calendar from 'components/UI/Calendar';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Select from 'components/UI/Select';
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
  code: string;
  name: string;
  designateDate: Date | null;
  reportDate: Date | null;
  address: string;
  zipcode: string;
  person: string;
  contact: string;
  evaluationGrade: string;
  finalGrade: IOption | null;
}

const finalGradeOptions = [
  {
    value: 'A',
    name: 'A',
  },
  {
    value: 'B',
    name: 'B',
  },
  {
    value: 'C',
    name: 'C',
  },
  {
    value: 'D',
    name: 'D',
  },
  {
    value: 'E',
    name: 'E',
  },
];

const CareAdd = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    setValue,
    watch,
    getValues,
    reset,
    trigger,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      designateDate: null,
      reportDate: null,
      address: '',
      zipcode: '',
      person: '',
      contact: '',
      evaluationGrade: '',
      finalGrade: null,
    },
  });
  const { addCare, getCare, editCare } = useCareActions();
  const { handleShowAlert } = useAlert();
  const open = useDaumPostcodePopup();
  const [openDesignateCalendar, setOpenDesignateCalendar] = useState(false);
  const [openReportCalendar, setOpenReportCalendar] = useState(false);
  const navigate = useNavigate();

  register('address', {
    required: '주소를 입력해주세요',
  });

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      reset({
        code: '',
        name: '',
        designateDate: null,
        reportDate: null,
        address: '',
        zipcode: '',
        person: '',
        contact: '',
        evaluationGrade: '',
        finalGrade: null,
      });
    }
  }, [id]);

  const fetchDetail = async (residenceId: string) => {
    try {
      const data = await getCare(residenceId);
      reset({
        code: data.code,
        name: data.name,
        designateDate: new Date(data.date.designationDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        reportDate: new Date(data.date.installingDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        address: data.address.address,
        zipcode: data.address.zipcode,
        person: String(data.capacity),
        contact: data.address.phoneNumber,
        evaluationGrade: String(data.rating.score),
        finalGrade: finalGradeOptions.find((option) => option.value === data.rating.grade),
      });
      trigger();
    } catch (err) {
      handleShowAlert({
        type: 'error',
        title: '요양원 상세정보 조회 실패',
        description: isCustomError(err),
        onClose: () => {
          navigate(-1);
        },
      });
    }
  };

  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setValue('address', fullAddress, { shouldValidate: true });
    setValue('zipcode', data.zonecode, { shouldValidate: true });
  };

  const handleAddressOpen = () => {
    open({ onComplete: handleComplete });
  };

  const handleDesignateCalendarOpen = () => {
    setOpenDesignateCalendar(true);
  };

  const handleDesignateDateClose = () => {
    setOpenDesignateCalendar(false);
  };

  const handleDesignateSetDate = (date: Date) => {
    setValue('designateDate', date, { shouldValidate: true });
    setOpenDesignateCalendar(false);
  };

  const handleReportCalendarOpen = () => {
    setOpenReportCalendar(true);
  };

  const handleReportDateClose = () => {
    setOpenReportCalendar(false);
  };

  const handleReportSetDate = (date: Date) => {
    setValue('reportDate', date, { shouldValidate: true });
    setOpenReportCalendar(false);
  };

  const handleFinalGradeChange = (option: IOption) => {
    setValue('finalGrade', option, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async ({ address, code, contact, designateDate, evaluationGrade, finalGrade, name, person, reportDate, zipcode }) => {
    try {
      const formData = {
        code,
        name,
        zipcode,
        address,
        phoneNumber: formatter.removePhoneNumberHyphens(contact),
        designationDate: format(designateDate!, 'yyyyMMdd'),
        installingDate: format(reportDate!, 'yyyyMMdd'),
        capacity: Number(person),
      } as ICareForm;
      if (evaluationGrade) {
        formData['ratingScore'] = Number(evaluationGrade);
      }
      if (finalGrade) {
        formData['ratingGrade'] = String(finalGrade.value);
      }
      if (id) {
        await editCare(id, formData);
      } else {
        await addCare(formData);
      }
      handleShowAlert({
        type: 'success',
        title: id ? '요양원 수정 성공' : '요양원 등록 성공',
        description: id ? '요양원이 성공적으로 수정되었습니다.' : '요양원이 성공적으로 등록되었습니다.',
        onClose: () => {
          navigate(PATH.CARE_LIST);
        },
      });
    } catch (err) {
      handleShowAlert({
        type: 'error',
        title: id ? '요양원 수정 실패' : '요양원 등록 실패',
        description: isCustomError(err),
      });
    }
  });

  return (
    <Container>
      <PageHeader title={id ? '요양원 수정' : '요양원 등록'} />
      <Box mt="24px">
        <Form title="요양원 등록" onSubmit={onSubmit}>
          <Box>
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              장기요양기관코드
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('code', {
                required: '장기요양기관코드를 입력해주세요',
              })}
              placeholder="장기요양기관코드를 입력해주세요"
              size="xs"
              width="500px"
              mt="12px"
              disabled={!!id}
              error={errors.code?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              요양원명
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('name', {
                required: '요양원명을 입력해주세요',
              })}
              onChange={(e) => {
                const { onChange } = register('name');
                if (e.target.value.length > 13) {
                  setValue('name', e.target.value.slice(0, 13));
                  return;
                }
                onChange(e);
              }}
              size="xs"
              mt="12px"
              width="500px"
              placeholder="요양원명을 입력해주세요"
              error={errors.name?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              주소
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              name="aa"
              size="xs"
              mt="12px"
              width="500px"
              readOnly
              value={watch('address')}
              style={{ cursor: 'pointer' }}
              placeholder="주소를 선택해주세요"
              onClick={handleAddressOpen}
              error={errors.address?.message}
            />
            {/* <Input
              {...register('detailAddress', {
                required: '상세주소를 입력해주세요',
              })}
              size="xs"
              mt="8px"
              width="500px"
              placeholder="상세주소를 입력해주세요"
              error={errors.detailAddress?.message}
            /> */}
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              지정일자
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Box display="flex" mt="12px">
              <Box position="relative">
                <Input
                  className="address-input"
                  {...register('designateDate', {
                    required: '지정일자를 선택해주세요',
                  })}
                  value={watch('designateDate') ? format(watch('designateDate')!, 'yyyy-MM-dd') : ''}
                  error={errors.designateDate?.message}
                  onlyBorder
                  placeholder="지정일자을 선택해주세요"
                  width="500px"
                  size="xs"
                  readOnly
                  onClick={handleDesignateCalendarOpen}
                  iconAlign="left"
                  icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                />
                {openDesignateCalendar && (
                  <Box position="absolute" top="40px" left="0px">
                    <Calendar onCancel={handleDesignateDateClose} date={watch('designateDate')} onConfirm={handleDesignateSetDate} type="search" />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              설치신고일자
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Box display="flex" mt="12px">
              <Box position="relative">
                <Input
                  className="address-input"
                  {...register('reportDate', {
                    required: '설치 신고일자를 선택해주세요',
                  })}
                  value={watch('reportDate') ? format(watch('reportDate')!, 'yyyy-MM-dd') : ''}
                  error={errors.reportDate?.message}
                  onlyBorder
                  placeholder="설치 신고일자을 선택해주세요"
                  width="500px"
                  size="xs"
                  readOnly
                  onClick={handleReportCalendarOpen}
                  iconAlign="left"
                  icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                />
                {openReportCalendar && (
                  <Box position="absolute" top="40px" left="0px">
                    <Calendar onCancel={handleReportDateClose} date={watch('reportDate')} onConfirm={handleReportSetDate} type="search" />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              총 정원
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('person', {
                required: '총 정원을 입력해주세요',
              })}
              onChange={(e) => {
                const { onChange } = register('person');
                e.target.value = formatter.onlyNumber(e.target.value);
                onChange(e);
              }}
              size="xs"
              mt="12px"
              width="500px"
              placeholder="총 정원을 입력해주세요"
              error={errors.person?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              전화번호
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Input
              {...register('contact', {
                required: '전화번호를 입력해주세요',
              })}
              onChange={(e) => {
                const { onChange } = register('contact');
                const { contact } = getValues();
                let selectStart = e.target.selectionStart;
                e.target.value = formatter.formatKoreanPhoneNumber(e.target.value);
                selectStart = formatter.selectContactRange(e.target.value, contact, Number(selectStart));
                e.target.setSelectionRange(e.target.value.length, selectStart);
                onChange(e);
              }}
              size="xs"
              mt="12px"
              width="500px"
              placeholder="전화번호를 입력해주세요"
              error={errors.contact?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
              최종등급
            </Box>
            <Select
              list={finalGradeOptions}
              width="500px"
              mt="12px"
              size="xs"
              placeholder="최종등급을 선택해주세요"
              selectOption={watch('finalGrade')}
              onClick={handleFinalGradeChange}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
              평가점수
            </Box>
            <Input
              {...register('evaluationGrade')}
              onChange={(e) => {
                const { onChange } = register('evaluationGrade');
                e.target.value = formatter.onlyNumberAndDot(e.target.value);
                onChange(e);
              }}
              size="xs"
              mt="12px"
              width="500px"
              placeholder="평가등급을 입력해주세요"
            />
          </Box>
          <Box d="flex" alignItems="center" mt="24px">
            <Button type="submit" width="200px" disabled={!isValid || isSubmitting}>
              {id ? '수정' : '등록'}
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
};

export default CareAdd;
