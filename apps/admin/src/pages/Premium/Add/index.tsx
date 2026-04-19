/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { useFieldArray, useForm } from 'react-hook-form';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useNavigate, useParams } from 'react-router-dom';
import color from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';
import useCareActions from 'actions/care-actions';
import { useCommonActions } from 'actions/common-actions';
import usePremiumActions from 'actions/premium-actions';
import { format } from 'date-fns';
import { useAlert } from 'providers';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import fontSize from 'tui-editor-plugin-font-size';
import { ICare } from 'types/care';
import { IOption, IRegion, IRegionSub } from 'types/common';
import { priceList, serviceList, sortRegionList, themeList, validList } from 'utils/common';
import { delay } from 'utils/delay';
import { isCustomError } from 'utils/error';
import { formatter } from 'utils/formatter';
import { PATH } from 'utils/path';

import PageHeader from 'components/common/PageHeader';
import ArrowLeft from 'components/SVG/icons/arrow-left';
import ArrowRight from 'components/SVG/icons/arrow-right';
import CalendarIcon from 'components/SVG/icons/calendar-icon';
import CloseRound from 'components/SVG/icons/close-round';
import Plus from 'components/SVG/icons/plus';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Calendar from 'components/UI/Calendar';
import CheckBox from 'components/UI/CheckBox';
import Form from 'components/UI/Form';
import Input from 'components/UI/Input';
import Select from 'components/UI/Select';
import Typography from 'components/UI/Typography';

import '@toast-ui/editor/dist/i18n/ko-kr';

import 'tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css';

const Container = styled.section`
  padding-bottom: 100px;
  ul.care-list {
    position: absolute;
    top: 34px;
    left: 0px;
    width: 400px;
    background-color: white;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 8px;
    z-index: 10;
    max-height: 130px;
    overflow-y: auto;
    li {
      cursor: pointer;
      padding: 8px 0;
      border-bottom: 1px solid #e5e5e5;
      &:hover {
        background-color: #f7f7f7;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  ul.image-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    li {
      width: 200px;
      height: 200px;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      margin-right: 8px;
      position: relative;
      margin-bottom: 8px;
      &:last-child {
        margin-right: 0;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .main-image {
        position: absolute;
        top: 8px;
        left: 8px;
        padding: 4px 8px;
        background-color: ${({ theme }) => theme.color.black};
        color: ${({ theme }) => theme.color.white};
        border-radius: 4px;
        font-size: 12px;
      }
      .arrow-left {
        position: absolute;
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .arrow-right {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
  ul.region-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 12px;
    li {
      display: flex;
      align-items: center;
      margin-right: 12px;
      .arrow-up {
        cursor: pointer;
        margin-left: 8px;
        transform: rotate(90deg);
      }
      .arrow-down {
        cursor: pointer;
        margin-left: 8px;
        transform: rotate(-90deg);
      }
    }
  }
`;

interface IFormValues {
  residenceId: string;
  plan: IOption | null;
  imageList: {
    id: string | number;
    fileId: string | number;
    name: string;
  }[];
  oneIntroduce: string;
  region: {
    regionId: string;
  }[];
  introduce: string;
  startDate: Date | null;
  endDate: Date | null;
  youtubeList: {
    name: string;
  }[];
  themeList: IOption[];
  serviceList: IOption[];
  contact: string;
  person: string;
  address: string;
  detailAddress: string;
  zipcode: string;
  lat: number | null;
  lng: number | null;
  price: string;
  snackPrice: string;
  valid: IOption;
}

const PremiumAdd = () => {
  const { id } = useParams<{ id: string }>();
  const { getCares } = useCareActions();
  const { handleShowAlert } = useAlert();
  const { fileUpload, getLocation, getRegions } = useCommonActions();
  const { addPremium, editPremium, getPremium, editPremiumValid } = usePremiumActions();
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      residenceId: '',
      plan: null,
      imageList: [],
      region: [],
      oneIntroduce: '',
      introduce: '',
      startDate: null,
      endDate: null,
      youtubeList: [],
      themeList: [],
      serviceList: [],
      contact: '',
      person: '',
      address: '',
      detailAddress: '',
      zipcode: '',
      lat: null,
      lng: null,
      price: '',
      snackPrice: '',
      valid: {
        value: 'Y',
        name: '노출',
      },
    },
  });
  const { fields, update, append, remove } = useFieldArray({
    control,
    name: 'imageList',
  });
  const { fields: regionFields } = useFieldArray({
    control,
    name: 'region',
  });
  const {
    fields: youtubeFields,
    append: youtubeAppend,
    remove: youtubeRemove,
  } = useFieldArray({
    control,
    name: 'youtubeList',
  });
  const {
    fields: themeFields,
    append: themeAppend,
    remove: themeRemove,
  } = useFieldArray({
    control,
    name: 'themeList',
  });

  const {
    fields: serviceFields,
    append: serviceAppend,
    remove: serviceRemove,
  } = useFieldArray({
    control,
    name: 'serviceList',
  });

  const [careList, setCareList] = useState<ICare[]>([]);
  const editorRef = useRef<Editor>(null);
  const [search, setSearch] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const filePath = useRef<HTMLInputElement | null>(null);
  const [openStartCalendar, setOpenStartCalendar] = useState(false);
  const [openEndCalendar, setOpenEndCalendar] = useState(false);
  const open = useDaumPostcodePopup();
  const [_] = useKakaoLoader({
    appkey: 'dd28c8713a5fdbd161c0b1cc617dbddb',
  });
  const [regionList, setRegionList] = useState<IRegion[]>([]);
  const [selectRegionSubList, setSelectRegionSubList] = useState<IRegion[]>([]);

  const navigate = useNavigate();

  register('plan', {
    required: '요금제를 선택해주세요',
  });

  register('valid', {
    required: '노출여부를 선택해주세요',
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const list = await getRegions();
      const sortedList = sortRegionList.map((regionName) => list.find((region) => region.name === regionName)!).filter((item) => item);

      setRegionList(sortedList);
    } catch (err) {
      handleShowAlert({
        type: 'error',
        title: '지역 목록 조회 실패',
        description: isCustomError(err),
      });
    }
  };

  useEffect(() => {
    if (id && regionList.length) {
      fetchDetail(id);
    } else {
      reset({
        residenceId: '',
        plan: null,
        imageList: [],
        oneIntroduce: '',
        region: [],
        introduce: '',
        startDate: null,
        endDate: null,
        youtubeList: [],
        themeList: [],
        serviceList: [],
        contact: '',
        person: '',
        address: '',
        detailAddress: '',
        zipcode: '',
        lat: null,
        lng: null,
        price: '',
        valid: {
          value: 'Y',
          name: '노출',
        },
      });
    }
  }, [id, JSON.stringify(regionList)]);

  const fetchDetail = async (residenceId: string) => {
    try {
      const detail = await getPremium(residenceId);
      const region = detail.regions.map((item) => item.subs.map((sub) => ({ regionId: sub.regionId }))).flat();
      reset({
        residenceId: detail.residenceId,
        plan: {
          value: detail.plan.type.code,
          name: detail.plan.type.name,
        },
        imageList: detail.imageUrls.map((item, index) => ({
          id: index,
          fileId: index,
          name: item,
        })),
        oneIntroduce: detail.comment,
        region,
        introduce: detail.explain,
        startDate: new Date(detail.plan.startDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        endDate: new Date(detail.plan.endDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        youtubeList: detail.youtubeUrls.map((item) => ({ name: item })),
        themeList: [...new Set(detail.themes.map((item) => ({ value: item.code, name: item.name })))],
        serviceList: detail.services.map((item) => ({ value: item.code, name: item.name })),
        contact: formatter.formatKoreanPhoneNumber(detail.address.phoneNumber),
        person: String(detail.capacity),
        address: detail.address.address1,
        detailAddress: detail.address.address2,
        zipcode: detail.address.zipcode,
        lat: detail.address.latitude,
        lng: detail.address.longitude,
        price: formatter.addComma(String(detail.mealAmount)),
        snackPrice: formatter.addComma(String(detail.snackAmount)),
        valid:
          detail.valid === 'Y'
            ? {
                value: 'Y',
                name: '노출',
              }
            : {
                value: 'N',
                name: '노출 안함',
              },
      });
      editorRef.current?.getInstance().setHTML(detail.explain, false);
      editorRef.current?.getInstance().blur();
      const parsingSelectRegionSubList = [] as IRegion[];
      detail.regions.forEach((item) => {
        item.subs.forEach((subItem) => {
          const findRegion = regionList.find((region) => region.subs.some((sub) => sub.regionId === subItem.regionId));
          if (findRegion) {
            const findParsingRegion = parsingSelectRegionSubList.find((region) => region.name === findRegion.name);
            if (!findParsingRegion) {
              parsingSelectRegionSubList.push(findRegion);
            }
          }
        });

        // const findRegion = regionList.find((region) => region.subs.some((sub) => sub.regionId === item.subs));
        // if (parsingSelectRegionSubList.map((item) => item.name).includes(findRegion!.name)) return;
        // parsingSelectRegionSubList.push(findRegion!);
      });
      setSearch(detail.name);
      setSelectRegionSubList(parsingSelectRegionSubList);
      watch();
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
        onClose: () => {
          navigate(-1);
        },
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      fetchCareList();
    }
  };

  const fetchCareList = async () => {
    try {
      const list = await getCares({ query: search });
      if (!list.length) {
        handleShowAlert({
          title: '알림',
          description: '검색 결과가 없습니다.',
          type: 'info',
        });
        return;
      }
      setCareList(list);
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handlePlanChange = (value: IOption) => {
    setValue('plan', value, { shouldValidate: true });
  };

  const handleValidChange = (value: IOption) => {
    setValue('valid', value, { shouldValidate: true });
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
      const files = 'files' in e ? e.files : e.target.files;
      if (!files) return;
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 1024 * 1024 * 10) {
          handleShowAlert({
            title: '알림',
            description: '10MB 이하의 파일만 업로드 가능합니다.',
            type: 'info',
          });
          return;
        }
        if (!files[i].type.includes('image')) {
          handleShowAlert({
            title: '알림',
            description: '이미지 파일만 업로드 가능합니다.',
            type: 'info',
          });
          return;
        }
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const id = await fileUpload('/v1/uploads/residence/images', file);
        append({ id, fileId: id, name: URL.createObjectURL(file) });
      }
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handleImageLeft = (index: number) => {
    if (fields.length <= 1) return;
    if (index === 0) return;
    const prev = fields[index - 1];
    update(index - 1, fields[index]);
    update(index, prev);
  };

  const handleImageRight = (index: number) => {
    if (fields.length <= 1) return;
    if (index === fields.length - 1) return;
    const next = fields[index + 1];
    update(index + 1, fields[index]);
    update(index, next);
  };

  const handleImageRemove = (index: number) => {
    remove(index);
  };

  const handleYoutubeAppend = () => {
    youtubeAppend({ name: '' });
  };

  const handleYoutubeRemove = (index: number) => {
    youtubeRemove(index);
  };

  const handleThemeCheck = (theme: IOption) => {
    if (themeFields.some((themeCheck) => themeCheck.value === theme.value)) {
      const index = themeFields.findIndex((themeCheck) => themeCheck.value === theme.value);
      themeRemove(index);
    } else {
      if (themeFields.length >= 6) {
        handleShowAlert({
          title: '알림',
          description: '테마는 6개까지 선택 가능합니다.',
          type: 'info',
        });
        return;
      }
      themeAppend(theme);
    }
  };

  const handleServiceCheck = (service: IOption) => {
    if (serviceFields.some((serviceCheck) => serviceCheck.value === service.value)) {
      const index = serviceFields.findIndex((serviceCheck) => serviceCheck.value === service.value);
      serviceRemove(index);
    } else {
      if (service.value === 'OD') {
        const index = serviceFields.findIndex((serviceCheck) => serviceCheck.value === 'WA');
        if (index > -1) {
          serviceRemove(index);
        }
      } else if (service.value === 'WA') {
        const index = serviceFields.findIndex((serviceCheck) => serviceCheck.value === 'OD');
        if (index > -1) {
          serviceRemove(index);
        }
      }
      serviceAppend(service);
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
    const target = e.target as HTMLElement; // e.target을 HTMLElement로 캐스팅
    if (target.id !== 'endDate') {
      setOpenEndCalendar(false);
    }
  };

  const handleEndSetDate = (date: Date) => {
    setValue('endDate', date, { shouldValidate: true });
    setOpenEndCalendar(false);
  };

  const handleEditChange = () => {
    setValue('introduce', editorRef.current?.getInstance().getHTML(), { shouldValidate: true });
  };

  const handleComplete = async (data: Address) => {
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
    try {
      const { latitude, longitude } = await getLocation(fullAddress);
      setValue('lat', latitude, { shouldValidate: true });
      setValue('lng', longitude, { shouldValidate: true });
    } catch (err) {
      handleShowAlert({
        title: '알림',
        description: isCustomError(err),
        type: 'error',
      });
    }
  };

  const handleAddressOpen = () => {
    open({ onComplete: handleComplete });
  };

  const onResidenceRemove = () => {
    if (id) {
      return;
    }
    setValue('residenceId', '');
  };

  const handleCareSelect = (residenceId: string, name: string) => {
    setValue('residenceId', residenceId, { shouldValidate: true });
    setSearch(name);
    setCareList([]);
  };

  const onSubmit = handleSubmit(
    async ({
      residenceId,
      plan,
      imageList,
      oneIntroduce,
      region,
      introduce,
      startDate,
      endDate,
      youtubeList,
      themeList,
      serviceList,
      contact,
      person,
      address,
      detailAddress,
      zipcode,
      lat,
      lng,
      price,
      snackPrice,
      valid,
    }) => {
      try {
        const formData = {
          residenceId,
          plan: {
            code: String(plan!.value),
            startDate: format(startDate!, 'yyyyMMdd'),
            endDate: format(endDate!, 'yyyyMMdd'),
          },
          address: {
            zipcode,
            address1: address,
            address2: detailAddress,
            phoneNumber: formatter.removePhoneNumberHyphens(contact),
            latitude: lat!,
            longitude: lng!,
          },
          comment: oneIntroduce,
          explain: introduce,
          capacity: Number(person),
          mealAmount: Number(formatter.removeComma(price)),
          snackAmount: Number(formatter.removeComma(snackPrice)),
          regions: region.map((item) => item.regionId),
          themes: themeList.map((item) => String(item.value)),
          services: serviceList.map((item) => String(item.value)),
          youtubeUrls: youtubeList.map((item) => item.name),
          imageIds: imageList.map((item) => {
            if (typeof item.fileId === 'string') {
              return item.fileId;
            }
            return item.name;
          }),
        };

        if (id) {
          await editPremium(formData);
          await delay(1000);
          await editPremiumValid(id, String(valid.value));
        } else {
          await addPremium(formData);
        }

        handleShowAlert({
          title: '알림',
          description: id ? '프리미엄 요양원이 수정되었습니다.' : '프리미엄 요양원이 등록되었습니다.',
          type: 'success',
          onClose: () => {
            navigate(PATH.PREMIUM_LIST);
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
  );

  const isRegionChecked = (subs: IRegionSub[]) => {
    // 모든 하위 regionId가 checkList에 포함되어 있는지 확인
    return subs.every((sub) => regionFields.map((region) => region.regionId).includes(sub.regionId));
  };

  const handleRegionClick = (e: React.MouseEvent<HTMLDivElement>, subs: IRegionSub[]) => {
    e.stopPropagation();
    let newCheckList = [...regionFields.map((region) => region.regionId)];
    const allIncluded = subs.every((sub) => newCheckList.includes(sub.regionId));
    if (allIncluded) {
      newCheckList = newCheckList.filter((id) => !subs.some((sub) => sub.regionId === id));
      // 모든 하위 항목이 포함되어 있는 경우 -> 모두 제거
      setValue(
        'region',
        newCheckList.map((regionId) => ({ regionId })),
        { shouldValidate: true },
      );
    } else {
      // 일부 또는 아무 것도 포함되어 있지 않은 경우 -> 모두 추가
      const newIds = subs.map((sub) => sub.regionId);
      newCheckList.push(...newIds);
      setValue(
        'region',
        [...new Set(newCheckList)].map((regionId) => ({ regionId })),
        { shouldValidate: true },
      );
    }
  };

  const handleCheck = (sub: IRegionSub) => {
    let newCheckList = [...regionFields.map((region) => region.regionId)];
    if (newCheckList.includes(sub.regionId)) {
      newCheckList = newCheckList.filter((id) => id !== sub.regionId);
      setValue(
        'region',
        newCheckList.map((regionId) => ({ regionId })),
        { shouldValidate: true },
      );
    } else {
      newCheckList.push(sub.regionId);
      setValue(
        'region',
        newCheckList.map((regionId) => ({ regionId })),
        { shouldValidate: true },
      );
    }
  };

  const handleSelectSub = (sub: IRegion) => {
    if (selectRegionSubList.some((item) => item.name === sub.name)) {
      setSelectRegionSubList(selectRegionSubList.filter((item) => item.name !== sub.name));
    } else {
      setSelectRegionSubList([...selectRegionSubList, sub]);
    }
  };

  return (
    <Container>
      <PageHeader title={id ? '프리미엄 요양원 수정' : '프리미엄 요양원 등록'} />
      <Box mt="24px">
        <Form title="프리미엄 요양원 등록" onSubmit={onSubmit}>
          <Box>
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              요양원 검색
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mt="12px" position="relative">
              <Input
                name="search"
                placeholder="요양원을 검색해주세요 ex) 요양원명, 기관코드"
                size="xs"
                width="400px"
                mr="8px"
                value={search}
                onChange={handleSearchChange}
                iconAlign={watch('residenceId') ? 'right' : 'none'}
                disabled={!!watch('residenceId') && !!id}
                icon={watch('residenceId') ? id ? undefined : <CloseRound width="16" height="16" color="black" onClick={onResidenceRemove} /> : undefined}
                onKeyDown={handleSearchDown}
              />
              {!id && (
                <Button width="92px" color="neutral" size="xs" onClick={fetchCareList} type="button">
                  검색
                </Button>
              )}
              {!!careList.length && (
                <ul className="care-list">
                  {careList.map((care) => (
                    <li key={care.residenceId} onClick={() => handleCareSelect(care.residenceId, care.name)}>
                      <Typography color={theme.color.black} fontSize={theme.fontSize.text14}>
                        {care.code} {care.name} ({care.address.address})
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              요금제 종류
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Select
              list={priceList}
              width="500px"
              mt="12px"
              size="xs"
              placeholder="요금제를 선택해주세요"
              selectOption={watch('plan')}
              onClick={handlePlanChange}
              error={errors.plan?.message}
            />
          </Box>
          <Box mt="12px">
            <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
              이미지 등록
              <Typography as="span" fontSize={theme.fontSize.text12} fontWeight={theme.fontWeight.normal} ml="16px">
                (JPG, JPEG, PNG 파일 업로드)
              </Typography>
              <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                *
              </Typography>
            </Box>
            <Box>
              <ul className="image-list">
                {fields.map((field, index) => (
                  <li key={`image-${index}`}>
                    {index === 0 && <div className="main-image">대표</div>}
                    <img src={field.name} />
                    <div className="close-btn" onClick={() => handleImageRemove(index)}>
                      <CloseRound width="24" height="24" color={theme.color.white} />
                    </div>
                    <div className="arrow-left" onClick={() => handleImageLeft(index)}>
                      <ArrowLeft width="24" height="24" color={theme.color.white} />
                    </div>
                    <div className="arrow-right" onClick={() => handleImageRight(index)}>
                      <ArrowRight width="24" height="24" color={theme.color.white} />
                    </div>
                  </li>
                ))}
                <li>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
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
                  <input ref={filePath} style={{ display: 'none' }} onChange={handleFileChange} type="file" accept=".jpg,.jpeg,.png" multiple />
                </li>
              </ul>
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                한줄소개
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <Input
                {...register('oneIntroduce')}
                onChange={(e) => {
                  const { onChange } = register('oneIntroduce');
                  if (e.target.value.length > 46) {
                    setValue('oneIntroduce', e.target.value.slice(0, 46));
                    return;
                  }
                  onChange(e);
                }}
                placeholder="한줄소개를 입력해주세요"
                size="xs"
                width="500px"
                mt="12px"
                error={errors.oneIntroduce?.message}
              />
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                노출 지역
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <ul className="region-list">
                {regionList.map((region, index) => (
                  <li key={`region-${index}`}>
                    <CheckBox
                      name={region.name}
                      checked={isRegionChecked(region.subs)}
                      width="16"
                      height="16"
                      onClick={(e) => handleRegionClick(e, region.subs)}
                    >
                      {region.name}
                    </CheckBox>
                    {selectRegionSubList.map((sub) => sub.name).includes(region.name) ? (
                      <ArrowLeft width="16" height="16" className="arrow-up" onClick={() => handleSelectSub(region)} />
                    ) : (
                      <ArrowLeft width="16" height="16" className="arrow-down" onClick={() => handleSelectSub(region)} />
                    )}
                  </li>
                ))}
              </ul>
              {!!selectRegionSubList.length &&
                selectRegionSubList.map((region) => (
                  <Box mt="8px" key={`region-${region.name}`}>
                    <Typography fontSize={theme.fontSize.text14} fontWeight={theme.fontWeight.bold}>
                      {region.name}
                    </Typography>
                    <ul className="region-list">
                      {region.subs.map((region, index) => (
                        <li key={`region-${index}`} style={{ marginBottom: '8px' }}>
                          <CheckBox
                            name={region.name}
                            checked={regionFields.map((region) => region.regionId).includes(region.regionId)}
                            width="16"
                            height="16"
                            onClick={() => handleCheck(region)}
                          >
                            {region.name}
                          </CheckBox>
                        </li>
                      ))}
                    </ul>
                  </Box>
                ))}
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                요금제 등록기간
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
                    <Box position="absolute" top="40px" left="0px" zIndex={999}>
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
                    <Box position="absolute" top="40px" left="0px" zIndex={999}>
                      <Calendar onCancel={handleEndDateClose} date={watch('endDate')} onConfirm={handleEndSetDate} />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                대표소개/시설소개
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <Box mt="12px" width="800px" height="500px">
                <Editor
                  ref={editorRef}
                  previewStyle="vertical"
                  height="500px"
                  initialEditType="wysiwyg"
                  useCommandShortcut={false}
                  onChange={handleEditChange}
                  hideModeSwitch
                  language="ko"
                  plugins={[color, fontSize]}
                  placeholder="대표소개/시설소개를 입력해주세요"
                  toolbarItems={[
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'indent', 'outdent'],
                    ['table', 'image', 'link'],
                  ]}
                />
              </Box>
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                소개영상 (유튜브영상)
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <Box mt="12px">
                {youtubeFields.map((field, index) => (
                  <Box display="flex" alignItems="center" key={field.id} mt={index === 0 ? '0px' : '8px'}>
                    <Input
                      {...register(`youtubeList.${index}.name`, {
                        required: '유튜브 영상을 입력해주세요',
                      })}
                      width="500px"
                      size="xs"
                      mr="8px"
                      placeholder="https://www.youtube.com/embed/WZfdSYee5vM?si=q096Gxq3DBiP10G0"
                    />
                    <Button variant="outline" color="error" size="xs" className="plus-btn" width="92px" onClick={() => handleYoutubeRemove(index)}>
                      제거
                    </Button>
                  </Box>
                ))}
                <Box display="flex" alignItems="center" mt="8px">
                  <Button variant="outline" color="primary" size="xs" className="plus-btn" width="600px" onClick={handleYoutubeAppend}>
                    추가
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                테마
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <ul className="region-list">
                {themeList.map((theme, index) => (
                  <li key={`theme-${index}`}>
                    <CheckBox
                      name="useAgree"
                      checked={themeFields.some((themeCheck) => themeCheck.value === theme.value)}
                      width="16"
                      height="16"
                      onClick={() => handleThemeCheck(theme)}
                    >
                      {theme.name}
                    </CheckBox>
                  </li>
                ))}
              </ul>
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                편의사항
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <ul className="region-list">
                {serviceList.map((service, index) => (
                  <li key={`service-${index}`}>
                    <CheckBox
                      name="useAgree"
                      checked={serviceFields.some((serviceCheck) => serviceCheck.value === service.value)}
                      width="16"
                      height="16"
                      onClick={() => handleServiceCheck(service)}
                    >
                      {service.name}
                    </CheckBox>
                  </li>
                ))}
              </ul>
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
            <Input {...register('detailAddress', {})} size="xs" mt="12px" width="500px" placeholder="상세주소를 입력해주세요(선택)" />
            {watch('lat') && watch('lng') && (
              <Box width="600px" mt="12px">
                <Map center={{ lat: watch('lat')!, lng: watch('lng')! }} style={{ width: '100%', height: '360px' }}>
                  <MapMarker position={{ lat: watch('lat')!, lng: watch('lng')! }} />
                </Map>
              </Box>
            )}
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                한끼 식사 비용
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <Input
                {...register('price', {
                  required: '한끼 식사비용을 입력해주세요',
                })}
                onChange={(e) => {
                  const { onChange } = register('price');
                  e.target.value = e.target.value ? formatter.addComma(e.target.value) : '';
                  onChange(e);
                }}
                size="xs"
                mt="12px"
                width="500px"
                placeholder="한끼 식사비용을 입력해주세요"
                error={errors.person?.message}
              />
            </Box>
            <Box mt="12px">
              <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                간식비
                <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                  *
                </Typography>
              </Box>
              <Input
                {...register('snackPrice', {
                  required: '간식비를 입력해주세요',
                })}
                onChange={(e) => {
                  const { onChange } = register('snackPrice');
                  e.target.value = e.target.value ? formatter.addComma(e.target.value) : '';
                  onChange(e);
                }}
                size="xs"
                mt="12px"
                width="500px"
                placeholder="간식비를 입력해주세요"
                error={errors.snackPrice?.message}
              />
            </Box>
            {id && (
              <Box mt="12px">
                <Box fontSize={theme.fontSize.text14} color={theme.color.gray900} fontWeight={theme.fontWeight.semiBold} display="flex" alignItems="center">
                  노출 여부
                  <Typography fontSize={theme.fontSize.text14} color={theme.color.red500}>
                    *
                  </Typography>
                </Box>
                <Select
                  list={validList}
                  width="500px"
                  mt="12px"
                  size="xs"
                  placeholder="노출여부를 선택해주세요"
                  selectOption={watch('valid')}
                  onClick={handleValidChange}
                  error={errors.valid?.message}
                />
              </Box>
            )}
          </Box>
          <Button width="200px" type="submit" onClick={onSubmit} mt="16px" disabled={!isValid || isSubmitting}>
            {id ? '수정' : '등록'}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};

export default PremiumAdd;
