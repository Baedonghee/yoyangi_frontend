import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useBannerActions from 'actions/banner-actions';
import { format } from 'date-fns';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { bannerListSelector, bannerPageSelector } from 'stores/banner';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IBannerQuery } from 'types/banner';
import { IOption } from 'types/common';
import { positionList } from 'utils/common';
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
      &.image-td {
        img {
          width: 200px;
          margin: 8px;
        }
      }
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
  name: string;
  position: IOption | null;
  startDate: Date | null;
  endDate: Date | null;
}

const BannerList = () => {
  const list = useRecoilValue(bannerListSelector);
  const page = useRecoilValue(bannerPageSelector);
  const { getBanners, deleteBanner } = useBannerActions();
  const { handleShowAlert, handleClose } = useAlert();
  const { register, watch, setValue, handleSubmit } = useForm<IFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      position: {
        value: '',
        name: '전체',
      },
      startDate: null,
      endDate: null,
    },
  });

  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);

  const { search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
    if (query.title) {
      setValue('name', query.title as string);
    } else {
      setValue('name', '');
    }
    if (query.location) {
      setValue('position', positionList.find((item) => item.value === query.location) || null);
    } else {
      setValue('position', {
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
  }, [search]);

  const fetchBanners = async () => {
    try {
      await getBanners(query);
    } catch (error) {
      handleShowAlert({
        description: isCustomError(error),
        type: 'error',
        title: '알림',
      });
    }
  };

  const handlePosition = (option: IOption) => {
    setValue('position', option);
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

  const onSubmit = handleSubmit((data) => {
    const queryData = {} as IBannerQuery;
    if (data.name) {
      queryData.title = data.name;
    }
    if (data.position?.value) {
      queryData.location = String(data.position.value);
    }
    if (data.startDate) {
      queryData.startDate = format(data.startDate, 'yyyy-MM-dd');
    }
    if (data.endDate) {
      queryData.endDate = format(data.endDate, 'yyyy-MM-dd');
    }
    navigate(`${PATH.BANNER_LIST}?${qs.stringify(queryData)}`);
  });

  const handleDelete = (bannerId: string) => {
    handleShowAlert({
      title: '알림',
      description: '삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteBanner(bannerId);
          handleShowAlert({
            description: '삭제되었습니다.',
            title: '알림',
            type: 'success',
            onClose: () => {
              handleClose();
              fetchBanners();
            },
          });
        } catch (error) {
          handleShowAlert({
            description: isCustomError(error),
            title: '알림',
            type: 'error',
          });
        }
      },
    });
  };

  const handleReset = () => {
    navigate(PATH.BANNER_LIST);
  };

  return (
    <Container>
      <PageHeader title="배너 목록" />
      <Box mt="24px">
        <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
          검색
        </Typography>
        <Form title="배너검색" onSubmit={onSubmit}>
          <Box mt="16px" borderRadius="12px" border={`1px solid ${theme.color.gray300}`} p="24px">
            <Box display="flex" gap="12px">
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  제목
                </Typography>
                <Input {...register('name')} size="xs" width="100%" placeholder="제목을 입력해주세요" />
              </Box>
              <Box flex="1">
                <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                  위치
                </Typography>
                <Select
                  list={[{ value: '', name: '전체' }, ...positionList]}
                  size="xs"
                  placeholder="위치를 선택해주세요"
                  selectOption={watch('position')}
                  onClick={handlePosition}
                />
              </Box>
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
            </Box>
            <Box mt="24px" display="flex" justifyContent="end">
              <Button size="xs" width="80px" variant="outline" mr="12px" onClick={handleReset}>
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
        <Link to={PATH.BANNER_ADD}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>배너 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>위치</th>
                <th>이미지</th>
                <th>노출기간</th>
                <th>링크</th>
                <th>등록자</th>
                <th>등록일자</th>
                <th>관리</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.bannerId}>
                    <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                    <td>{item.title}</td>
                    <td>{item.location.name}</td>
                    <td className="image-td">
                      <img src={item.imageUrl} alt="배너 이미지" />
                    </td>
                    <td>{`${item.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} ~ ${item.endDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}`}</td>
                    <td>
                      <a href={item.linkUrl} target="_blank" rel="noreferrer" className="underline">
                        {item.linkUrl}
                      </a>
                    </td>
                    <td>{item.creator}</td>
                    <td>{item.createdAt}</td>
                    <td>
                      <Box d="flex" justifyContent="space-between">
                        <Link to={PATH.BANNER_EDIT.replace(':id', item.bannerId)}>
                          <Button size="xs" width="90px" mr="8px" color="primary" variant="outline">
                            수정
                          </Button>
                        </Link>
                        <Button size="xs" width="90px" mr="8px" color="error" onClick={() => handleDelete(item.bannerId)}>
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

export default BannerList;
