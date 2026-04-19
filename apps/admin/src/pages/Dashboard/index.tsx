import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCareActions from 'actions/care-actions';
import useMemberActions from 'actions/member-actions';
import usePremiumActions from 'actions/premium-actions';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { ICareTotal } from 'types/care';
import { IMember } from 'types/member';
import { IPremium } from 'types/premium';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';

const Container = styled.section`
  background-color: #f9f9f9;
  padding: 24px;
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
  .care-table {
    th,
    td {
      &:nth-child(1) {
        width: 70px;
      }
      &:last-child {
        width: 150px;
      }
    }
  }
  .stats-box {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;

    .stat-item {
      flex: 1;
      padding: 24px;
      background: linear-gradient(145deg, #ffffff, #f1f1f1);
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1), -4px -4px 10px rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      text-align: center;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.15), -6px -6px 15px rgba(255, 255, 255, 0.8);
      }

      .stat-title {
        font-size: 14px;
        color: #777;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .section {
    margin-bottom: 40px;

    .section-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      border-left: 4px solid #4caf50;
      padding-left: 8px;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #ffffff;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      margin-bottom: 12px;

      &:hover {
        background: #f6f9fc;
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
      }

      .item-name {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }

      .item-info {
        font-size: 14px;
        color: #888;
      }

      .action-btn {
        padding: 6px 12px;
        background-color: #4caf50;
        color: #ffffff;
        font-size: 14px;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        transition: background 0.3s ease;

        &:hover {
          background-color: #45a049;
        }
      }
    }
  }
`;

const Dashboard = () => {
  const { getMembers } = useMemberActions();
  const { getCareTotal } = useCareActions();
  const { getPremiums } = usePremiumActions();
  const [memberList, setMemberList] = useState<IMember[]>([]);
  const [careTotal, setCareTotal] = useState<ICareTotal | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);
  const [premiumList, setPremiumList] = useState<IPremium[]>([]);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const { handleShowAlert } = useAlert();

  useEffect(() => {
    fetchMemberList();
    fetchCareTotal();
    fetchPremiumList();
  }, []);

  const fetchPremiumList = async () => {
    try {
      const results = await getPremiums({
        expiring: 'Y',
      });
      setPremiumList(results);
    } catch (err) {
      handleShowAlert({
        title: '프리미엄 목록 조회 실패',
        description: isCustomError(err),
        type: 'error',
      });
    } finally {
      setPremiumLoading(false);
    }
  };

  const fetchCareTotal = async () => {
    try {
      const results = await getCareTotal();
      setCareTotal(results);
    } catch (err) {
      handleShowAlert({
        title: '요양원 목록 조회 실패',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const fetchMemberList = async () => {
    try {
      const results = await getMembers({ today: 'TRUE' });
      setMemberList(results);
    } catch (err) {
      handleShowAlert({
        title: '회원 목록 조회 실패',
        description: isCustomError(err),
        type: 'error',
      });
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <Container>
      <PageHeader title="대시보드" />
      <Box mt="24px">
        <Box mt="24px">
          {/* 통계 섹션 */}
          <div className="stats-box">
            <div className="stat-item">
              <div className="stat-title">총 요양원 수</div>
              <div className="stat-value">{careTotal ? careTotal?.total + careTotal?.basic : 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">플래티넘 요금제 요양원</div>
              <div className="stat-value">{careTotal?.p3}</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">골드 요금제 요양원</div>
              <div className="stat-value">{careTotal?.p2}</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">실버 요금제 요양원</div>
              <div className="stat-value">{careTotal?.p1}</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">일반 요양원</div>
              <div className="stat-value">{careTotal?.basic}</div>
            </div>
            <div className="stat-item">
              <div className="stat-title">만료 예정 요양원 (한달)</div>
              <div className="stat-value">{careTotal?.expiring}</div>
            </div>
          </div>

          {/* 신규 가입 섹션 */}
          <div className="section">
            <div className="section-title">신규 가입 회원</div>
            <Box mt="16px">
              <table className="my-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>이메일</th>
                    <th>가입일</th>
                  </tr>
                </thead>
                {!memberLoading && (
                  <tbody>
                    {memberList.length ? (
                      memberList.map((member, index) => (
                        <tr key={member.memberId}>
                          <td>{memberList.length - index}</td>
                          <td>{member.profile.name}</td>
                          <td>{formatter.phoneNumberWithInputHyphens(member.profile.mobile)}</td>
                          <td>{member.email}</td>
                          <td>{member.createdAt}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>신규 가입 회원이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </Box>
          </div>

          {/* 요금제 만료 알림 섹션 */}
          <div className="section">
            <div className="section-title">요금제 만료 예정 요양원</div>
            <Box mt="16px">
              <table className="my-table care-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>기관코드</th>
                    <th>요양원명</th>
                    <th>요금종류</th>
                    <th>등록자</th>
                    <th>등록일자</th>
                    <th>노출기간</th>
                    <th>관리</th>
                  </tr>
                </thead>
                {!premiumLoading && (
                  <tbody>
                    {premiumList.length ? (
                      premiumList.map((premium, index) => (
                        <tr key={premium.residenceId}>
                          <td>{premiumList.length - index}</td>
                          <td>{premium.code}</td>
                          <td>{premium.name}</td>
                          <td>{premium.plan.name}</td>
                          <td>{premium.creator}</td>
                          <td>{premium.createdAt}</td>
                          <td>{`${premium.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} ~ ${premium.endDate.replace(
                            /(\d{4})(\d{2})(\d{2})/,
                            '$1-$2-$3',
                          )}`}</td>
                          <td>
                            <Box d="flex" justifyContent="center">
                              <Link to={PATH.PREMIUM_EDIT.replace(':id', premium.residenceId)}>
                                <Button size="xs" width="90px" color="primary" variant="outline">
                                  수정
                                </Button>
                              </Link>
                            </Box>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9}>만료 예정 요양원이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </Box>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
