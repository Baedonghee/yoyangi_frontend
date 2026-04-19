import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageViewer from 'react-simple-image-viewer';
import useReviewActions from 'actions/review-actions';
import { useAlert } from 'providers';
import qs from 'qs';
import { useRecoilValue } from 'recoil';
import { reviewListSelector, reviewPageSelector } from 'stores/review';
import styled from 'styled-components';
import { isCustomError } from 'utils/error';
import { calculateSequence } from 'utils/paging';

import PageHeader from 'components/common/PageHeader';
import ReviewRejectModal from 'components/Modal/ReviewReject';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import ModalContainer from 'components/UI/ModalContainer';
import Pagination from 'components/UI/Pagination';
import Typography from 'components/UI/Typography';

const Container = styled.section`
  .my-table {
    th,
    td {
      &:nth-child(1) {
        width: 70px;
      }
      &:last-child {
        width: 300px;
      }
    }
  }
`;

const homePageUrl = import.meta.env.VITE_HOMEPAGE_HOST;

const ReviewList = () => {
  const list = useRecoilValue(reviewListSelector);
  const page = useRecoilValue(reviewPageSelector);
  const { getReviews, approveReview, rejectReview, deleteReview } = useReviewActions();
  const { handleShowAlert, handleClose } = useAlert();
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = qs.parse(search, { ignoreQueryPrefix: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewId, setReviewId] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchList();
  }, [search]);

  const fetchList = async () => {
    try {
      await getReviews(query);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
        onClose: () => navigate(-1),
      });
    }
  };

  const handleDelete = (id: string) => {
    handleShowAlert({
      title: '알림',
      description: '정말 삭제하시겠습니까?',
      alertType: 'confirm',
      type: 'error',
      onConfirm: async () => {
        try {
          await deleteReview(id);
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

  const handleApprove = (id: string) => {
    handleShowAlert({
      title: '알림',
      description: '정말 승인하시겠습니까?',
      alertType: 'confirm',
      type: 'success',
      onConfirm: async () => {
        try {
          await approveReview(id);
          handleShowAlert({
            title: '알림',
            description: '승인되었습니다.',
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

  const handleReject = (id: string) => {
    setReviewId(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setReviewId('');
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const handleComplete = async (comment: string) => {
    try {
      await rejectReview(reviewId, { comment });
      handleShowAlert({
        title: '알림',
        description: '거절되었습니다.',
        type: 'success',
        onClose: () => {
          handleModalClose();
          handleClose();
          setReviewId('');
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
  };

  const handleImageClick = (imageUrl: string) => {
    setImages([imageUrl]);
    setIsViewerOpen(true);
  };

  return (
    <Container>
      {isModalOpen && (
        <ModalContainer onClose={handleModalClose}>
          <ReviewRejectModal onClose={handleModalClose} onComplete={handleComplete} />
        </ModalContainer>
      )}
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
          }}
          closeOnClickOutside={true}
        />
      )}
      <PageHeader title="리뷰 목록" />
      <Box mt="24px">
        <Box display="flex" justifyContent="space-between" alignItems="end">
          <Typography>리뷰 목록: {page?.totalItems}</Typography>
        </Box>
        <Box mt="16px">
          <table className="my-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>요양원 이름</th>
                <th>내용</th>
                <th>점수</th>
                <th>이미지</th>
                <th>등록자</th>
                <th>등록일자</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.reviewId}>
                    <td>{`${calculateSequence(page?.currentPage || 1, page?.size || 1, page?.totalItems || 1).reverse()[index]}`}</td>
                    <td>
                      <a href={`${homePageUrl}/care/${item.residence.residenceId}`} target="_blank" rel="noreferrer" className="underline">
                        {item.residence.name}
                      </a>
                    </td>
                    <td>{item.content}</td>
                    <td>{item.score}</td>
                    <td>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          style={{ width: '100px', height: '100px', padding: '8px', cursor: 'pointer' }}
                          onClick={() => handleImageClick(item.imageUrl!)}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{item.creator}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.status.name}</td>
                    <td>
                      <Box d="flex" justifyContent="center">
                        {item.status.code === 'W' && (
                          <>
                            <Button size="xs" width="90px" mr="8px" color="primary" onClick={() => handleApprove(item.reviewId)}>
                              승인
                            </Button>
                            <Button size="xs" width="90px" mr="8px" color="error" variant="outline" onClick={() => handleReject(item.reviewId)}>
                              거절
                            </Button>
                          </>
                        )}
                        <Button size="xs" width="90px" mr="8px" color="error" onClick={() => handleDelete(item.reviewId)}>
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

export default ReviewList;
