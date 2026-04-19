import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import usePremiumActions from 'actions/premium-actions';
import { format } from 'date-fns';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { premiumListSelector, premiumPageSelector } from 'stores/premium';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/common';
import { IPremiumQuery } from 'types/premium';
import { priceList } from 'utils/common';
import { isCustomError } from 'utils/error';
import { calculateSequence } from 'utils/paging';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import CalendarIcon from 'components/SVG/icons/calendar-icon';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Calendar from 'components/UI/Calendar';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Pagination from 'components/UI/Pagination';
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
  plan: IOption | null;
  startDate: Date | null;
  endDate: Date | null;
}

const PremiumList = () => {
  const list = useRecoilValue(premiumListSelector);
  const page = useRecoilValue(premiumPageSelector);
  const { register, watch, setValue, handleSubmit } = useForm<IFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
      name: '',
      plan: {
        value: '',
        name: '전체',
      },
      startDate: null,
      endDate: null,
    },
  });

  const { handleShowAlert, handleClose } = useAlert();
  const { getPremiums, deletePremium } = usePremiumActions();
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (query.code) {
      setValue('code', query.code as string);
    } else {
      setValue('code', '');
    }
    if (query.name) {
      setValue('name', query.name as string);
    } else {
      setValue('name', '');
    }
    if (query.plan) {
      setValue('plan', priceList.find((item) => item.value === query.plan) || null);
    } else {
      setValue('plan', {
        value: '',
        name: '전체',
      });
    }
    if (query.startDate) {
      setValue('startDate', new Date((query.startDate as string).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')));
    } else {
      setValue('startDate', null);
    }
    if (query.endDate) {
      setValue('endDate', new Date((query.endDate as string).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')));
    } else {
      setValue('endDate', null);
    }
    fetchList();
  }, [search]);

  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);

  const fetchList = async () => {
    try {
      await getPremiums(query);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handlePlan = (option: IOption) => {
    setValue('plan', option);
  };

  const handleStartCalendarOpen = () => {
    setOpenStartCalendar(true);
  };

  const handleStartDateClose = () => {
    setOpenStartCalendar(false);
  };

  const handleStartSetDate = (date: Date) => {
    setValue('startDate', date);
    setOpenStartCalendar(false);
  };

  const handleEndCalendarOpen = () => {
    setOpenEndCalendar(true);
  };

  const handleEndDateClose = () => {
    setOpenEndCalendar(false);
  };

  const handleEndSetDate = (date: Date) => {
    setValue('endDate', date);
    setOpenEndCalendar(false);
  };

  const onReset = () => {
    navigate(PATH.PREMIUM_LIST);
  };

  const onSubmit = handleSubmit(({ code, endDate, name, plan, startDate }) => {
    const queryData = {} as IPremiumQuery;
    if (code) {
      queryData.code = code;
    }
    if (name) {
      queryData.name = name;
    }
    if (plan?.value) {
      queryData.plan = String(plan.value);
    }
    if (startDate) {
      queryData.startDate = format(startDate, 'yyyyMMdd');
    }
    if (endDate) {
      queryData.endDate = format(endDate, 'yyyyMMdd');
    }
    navigate(`${PATH.PREMIUM_LIST}?${qs.stringify(queryData)}`);
  });

  const handleDelete = (residenceId: string) => {
    handleShowAlert({
      title: '알림',
      description: '삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deletePremium(residenceId);
          handleShowAlert({
            title: '알림',
            description: '삭제되었습니다.',
            type: 'success',
            onClose: () => {
              handleClose();
              fetchList();
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
      <PageHeader title="프리미엄 요양원 목록" />
      <Form title="프리미엄 요양원 검색" onSubmit={onSubmit}>
        <Box mt="16px" borderRadius="12px" border={`1px solid ${theme.color.gray300}`} p="24px">
          <Box display="flex" gap="12px">
            <Box flex="1">
              <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                기관코드
              </Typography>
              <Input {...register('code')} size="xs" width="100%" placeholder="기관코드를 입력해주세요" />
            </Box>
            <Box flex="1">
              <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                요양원명
              </Typography>
              <Input {...register('name')} size="xs" width="100%" placeholder="요양원명을 입력해주세요" />
            </Box>
            <Box flex="1">
              <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                요금제종류
              </Typography>
              <Select
                list={[{ value: '', name: '전체' }, ...priceList]}
                size="xs"
                placeholder="요금제종류를 선택해주세요"
                selectOption={watch('plan')}
                onClick={handlePlan}
              />
            </Box>
          </Box>
          <Box display="flex" gap="12px" mt="18px">
            <Box flex="1">
              <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                노출기간
              </Typography>
              <Box display="flex" alignItems="center" width="100%">
                <Box position="relative">
                  <Input
                    className="address-input"
                    {...register('startDate')}
                    value={watch('startDate') ? format(watch('startDate')!, 'yyyy-MM-dd') : ''}
                    onlyBorder
                    placeholder="시작날짜를 선택해주세요"
                    width="100%"
                    size="xs"
                    readOnly
                    onClick={handleStartCalendarOpen}
                    iconAlign="left"
                    icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                  />
                  {openStartCalendar && (
                    <Box position="absolute" top="40px" left="0px">
                      <Calendar onCancel={handleStartDateClose} date={watch('startDate')} onConfirm={handleStartSetDate} type="search" />
                    </Box>
                  )}
                </Box>
                <Typography fontSize={theme.fontSize.text16} m="0px 16px">
                  ~
                </Typography>
                <Box position="relative">
                  <Input
                    className="address-input"
                    {...register('endDate')}
                    value={watch('endDate') ? format(watch('endDate')!, 'yyyy-MM-dd') : ''}
                    onlyBorder
                    placeholder="종료날짜를 선택해주세요"
                    width="100%"
                    size="xs"
                    readOnly
                    onClick={handleEndCalendarOpen}
                    iconAlign="left"
                    icon={<CalendarIcon width="16" height="16" color={theme.color.gray300} />}
                  />
                  {openEndCalendar && (
                    <Box position="absolute" top="40px" left="0px">
                      <Calendar onCancel={handleEndDateClose} date={watch('endDate')} onConfirm={handleEndSetDate} type="search" />
                    </Box>
                  )}
                </Box>
              </Box>
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
      </Form>
      <Box display="flex" justifyContent="end" alignItems="center" mt="32px">
        <Link to={PATH.PREMIUM_ADD}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>프리미엄 요양원 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>기관코드</th>
                <th>요양원명</th>
                <th>요금종류</th>
                <th>등록자</th>
                <th>등록일자</th>
                <th>노출기간</th>
                <th>노출여부</th>
                <th>관리</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.residenceId}>
                    <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.plan.name}</td>
                    <td>{item.creator}</td>
                    <td>{item.createdAt}</td>
                    <td>{`${item.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} ~ ${item.endDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}`}</td>
                    <td>{item.valid === 'Y' ? '노출' : '노출 안함'}</td>
                    <td>
                      <Box d="flex" justifyContent="space-between">
                        <Link to={PATH.PREMIUM_EDIT.replace(':id', item.residenceId)}>
                          <Button size="xs" width="90px" mr="8px" color="primary" variant="outline">
                            수정
                          </Button>
                        </Link>
                        <Button size="xs" width="90px" mr="8px" color="error" onClick={() => handleDelete(item.residenceId)}>
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

export default PremiumList;
