import React, { useEffect, useState } from 'react';
import useYoutubeActions from 'actions/youtube-actions';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { IYoutube } from 'types/youtube';
import { isCustomError } from 'utils/error';

import ModalLayout from 'components/common/ModalLayout';
import ArrowLeft from 'components/SVG/icons/arrow-left';
import ArrowRight from 'components/SVG/icons/arrow-right';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';

const Container = styled.div`
  .arrow-up {
    cursor: pointer;
    border: 1px solid #e0e0e0;
    padding: 4px;
    border-radius: 4px;
    background-color: #f8f8f8;
    margin-right: 8px;
    svg {
      transform: rotate(90deg);
    }
  }
  .arrow-down {
    cursor: pointer;
    border: 1px solid #e0e0e0;
    padding: 4px;
    border-radius: 4px;
    background-color: #f8f8f8;
    svg {
      transform: rotate(90deg);
    }
  }
`;

interface IYoutubeOrder {
  onClose: () => void;
  handleChangeOrder: (list: IYoutube[]) => void;
}

const YoutubeOrder: React.FC<IYoutubeOrder> = ({ onClose, handleChangeOrder }) => {
  const { getYoutubes } = useYoutubeActions();
  const { handleShowAlert } = useAlert();
  const [list, setList] = useState<IYoutube[]>([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const result = await getYoutubes({ sort: 'order_asc' });
      setList(result);
    } catch (err) {
      handleShowAlert({
        description: isCustomError(err),
        title: '유튜브 목록 조회 실패',
        type: 'error',
      });
    }
  };

  const handleArrowUp = (index: number) => {
    if (index === 0) return;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    setList(newList);
  };

  const handleArrowDown = (index: number) => {
    if (index === list.length - 1) return;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    setList(newList);
  };

  return (
    <ModalLayout title="유튜브 순서 변경" width="1000px" onClose={onClose}>
      <Container>
        <Box mt="24px">
          <table className="my-table">
            <thead>
              <tr>
                <th />
                <th>번호</th>
                <th>제목</th>
                <th>링크</th>
                <th>순서</th>
              </tr>
            </thead>
            {!!list.length && (
              <tbody>
                {list.map((item, index) => (
                  <tr key={item.youtubeId}>
                    <td>
                      <Box display="flex" justifyContent="center" alignItems="center" p="4px">
                        <div className="arrow-up" onClick={() => handleArrowUp(index)}>
                          <ArrowLeft width="24" height="24" />
                        </div>
                        <div className="arrow-down" onClick={() => handleArrowDown(index)}>
                          <ArrowRight width="24" height="24" />
                        </div>
                      </Box>
                    </td>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.url}</td>
                    <td>{index + 1}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </Box>
        <Box mt="24px" display="flex" justifyContent="center">
          <Button size="l" width="150px" variant="outline" mr="24px" onClick={onClose}>
            취소
          </Button>
          <Button size="l" width="150px" onClick={() => handleChangeOrder(list)}>
            변경
          </Button>
        </Box>
      </Container>
    </ModalLayout>
  );
};

export default YoutubeOrder;
