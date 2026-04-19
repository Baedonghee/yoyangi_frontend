import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useCareActions from 'actions/care-actions';
import { useCommonActions } from 'actions/common-actions';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { careListSelector, carePageSelector } from 'stores/care';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { ICareQuery } from 'types/care';
import { delay } from 'utils/delay';
import { isCustomError } from 'utils/error';
import { calculateSequence } from 'utils/paging';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Pagination from 'components/UI/Pagination';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  /* 로딩 화면 전체 스타일 */
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6); /* 반투명 검정 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* 항상 최상단에 위치 */
  }

  /* 스피너 애니메이션 */
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.2); /* 외곽선 */
    border-top: 5px solid #ffffff; /* 스피너 상단 */
    border-radius: 50%;
    animation: spin 1s linear infinite; /* 회전 애니메이션 */
  }

  /* 애니메이션 키프레임 */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

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
}

const CareList = () => {
  const filePath = useRef<HTMLInputElement>(null);
  const list = useRecoilValue(careListSelector);
  const page = useRecoilValue(carePageSelector);
  const [isExcelUploadingSubmitting, setIsExcelUploadingSubmitting] = useState(false);
  const { getCares, deleteCare } = useCareActions();
  const { fileUpload } = useCommonActions();
  const { handleShowAlert, handleClose } = useAlert();
  const { register, setValue, handleSubmit } = useForm<IFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      code: '',
      name: '',
    },
  });
  const { search } = useLocation();
  const query = qs.parse(search, { ignoreQueryPrefix: true });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCares();
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
  }, [search]);

  const fetchCares = async () => {
    try {
      await getCares(query);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handleDelete = (residenceId: string) => {
    handleShowAlert({
      title: '알림',
      description: '삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteCare(residenceId);
          handleShowAlert({
            title: '요양원이 삭제되었습니다',
            type: 'check',
            onClose: () => {
              handleClose();
              fetchCares();
            },
          });
        } catch (err) {
          handleShowAlert({
            title: isCustomError(err),
            type: 'error',
          });
        }
      },
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const fileInput = e.target;
      const file = fileInput.files && fileInput.files[0];

      if (file) {
        // Check if the file type is Excel
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/haansoftxlsx') {
          // Handle the Excel file upload logic here
          setIsExcelUploadingSubmitting(true);
          await fileUpload('/v1/uploads/residences/excel', file);
          handleShowAlert({
            title: '요양원이 추가되었습니다',
            type: 'check',
          });
          await delay(1000);
          fetchCares();
        } else {
          handleShowAlert({
            title: '엑셀 파일만 업로드 가능합니다',
            type: 'error',
          });
        }
      }
    } catch (err) {
      console.log(err);
      handleShowAlert({
        title: isCustomError(err),
        type: 'error',
      });
    } finally {
      setIsExcelUploadingSubmitting(false);
    }
    e.target.value = '';
  };

  const handleExcelUpload = () => {
    filePath.current?.click();
  };

  const onSubmit = handleSubmit(({ code, name }) => {
    const queryData = {} as ICareQuery;
    if (code) {
      queryData.code = code;
    }
    if (name) {
      queryData.name = name;
    }
    navigate(`${PATH.CARE_LIST}?${qs.stringify(queryData)}`);
  });

  const handleReset = () => {
    navigate(PATH.CARE_LIST);
  };

  return (
    <Container>
      {isExcelUploadingSubmitting && (
        <div className="loading-screen">
          <div className="spinner" />
        </div>
      )}
      <PageHeader title="요양원 목록" />
      <Form title="요양원 검색" onSubmit={onSubmit}>
        <Box mt="24px">
          <Typography fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold}>
            검색
          </Typography>
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
              {/* <Box flex="1">
              <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700} fontWeight={theme.fontWeight.semiBold} mb="12px">
                유형
              </Typography>
              <Select
                list={[{ value: '', name: '전체' }, ...kindList]}
                size="xs"
                placeholder="가입상태를 선택해주세요"
                selectOption={watch('type')}
                onClick={handleType}
              />
            </Box> */}
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
        </Box>
      </Form>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt="32px">
        <input
          ref={filePath}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          type="file"
          accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <Button color="primary" variant="outline" size="xs" width="140px" disabled={isExcelUploadingSubmitting} onClick={handleExcelUpload}>
          요양원 자동 등록
        </Button>
        <Link to={PATH.CARE_ADD}>
          <Button color="neutral" variant="outline" size="xs" width="80px">
            등록
          </Button>
        </Link>
      </Box>
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>요양원 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>기관코드</th>
                <th>요양원명</th>
                <th>유형</th>
                <th>주소</th>
                <th>최종등급</th>
                <th>평가등급</th>
                <th>등록자</th>
                <th>등록일자</th>
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
                    <td>{item.type.name}</td>
                    <td>{item.address.address}</td>
                    <td>{item.rating?.grade || '-'}</td>
                    <td>{item.rating?.score || '-'}</td>
                    <td>{item.creator}</td>
                    <td>{item.createdAt}</td>
                    <td>
                      <Box d="flex" justifyContent="space-between">
                        <Link to={PATH.CARE_EDIT.replace(':id', item.residenceId)}>
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

export default CareList;
