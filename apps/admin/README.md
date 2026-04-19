# React 프로젝트

이 프로젝트는 Vite를 사용하여 설정된 React 요양이 어드민 프로젝트입니다. 아래는 프로젝트를 실행하고 관리하는 데 필요한 스크립트와 사용 방법에 대한 설명입니다.

## 스크립트 설명

### 개발 및 실행

- `yarn dev`  
  개발 서버를 시작합니다.  
  로컬에서 프로젝트를 실행하여 실시간으로 변경 사항을 확인할 수 있습니다.

  실행 명령어:

  ```bash
  yarn dev
  ```

- `yarn preview`  
  빌드된 애플리케이션을 미리보기 서버에서 실행합니다.  
  프로덕션 빌드를 테스트할 수 있습니다.

  실행 명령어:

  ```bash
  yarn preview
  ```

---

### 빌드

- `yarn build-development`  
  개발 환경용 빌드를 생성합니다.  
  TypeScript를 컴파일한 뒤, Vite를 사용하여 개발 모드로 앱을 빌드합니다.

  실행 명령어:

  ```bash
  yarn build-development
  ```

- `yarn build-production`  
  프로덕션 환경용 빌드를 생성합니다.  
  TypeScript를 컴파일한 뒤, Vite를 사용하여 최적화된 프로덕션 모드로 앱을 빌드합니다.

  실행 명령어:

  ```bash
  yarn build-production
  ```

---

### 프로덕션 실행

- `yarn prod`  
  프로덕션 환경에서 애플리케이션을 실행합니다.  
  Vite를 프로덕션 모드로 실행하여 최적화된 상태에서 앱을 제공합니다.

  실행 명령어:

  ```bash
  yarn prod
  ```

---

### 코드 품질 관리

- `yarn lint`  
  프로젝트 코드의 품질을 확인하고 규칙 위반 사항을 검사합니다.  
  ESLint를 사용하여 일관된 코드 스타일을 유지합니다.

  실행 명령어:

  ```bash
  yarn lint
  ```

---

## 프로젝트 설정

이 프로젝트는 Vite와 TypeScript를 기반으로 설정되었습니다. 시작하기 전에 아래 명령어를 사용하여 의존성을 설치하세요.

의존성 설치 명령어:

```bash
yarn install
```

---

## 추가 정보

프로젝트에 대한 자세한 정보는 아래 링크를 참고하세요:

- Vite 공식 문서: https://vitejs.dev/
- React 공식 문서: https://reactjs.org/
- ESLint 공식 문서: https://eslint.org/

---
