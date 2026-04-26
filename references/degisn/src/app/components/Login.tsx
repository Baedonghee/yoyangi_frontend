import { useNavigate, Link } from 'react-router';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 로직
    console.log('Kakao login');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full h-fit"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-16">
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <span className="text-4xl font-black text-gray-900">요양이</span>
        </Link>

        {/* Welcome Message */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">환영합니다!</h1>
          <p className="text-xl text-gray-700 font-medium leading-relaxed mb-4">
            요양이입니다
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            아이디와 비밀번호 입력하기 귀찮으시죠?<br />
            계정과 비밀번호 입력없이<br />
            <span className="font-bold text-gray-900">카카오톡으로 로그인</span> 해 보세요.
          </p>
        </div>

        {/* Kakao Login Button */}
        <button
          onClick={handleKakaoLogin}
          className="w-full flex justify-center items-center gap-3 py-6 px-8 rounded-2xl bg-[#FEE500] hover:bg-[#FDDC00] transition-colors text-xl font-bold text-gray-900"
        >
          <svg className="w-7 h-7" viewBox="0 0 48 48">
            <path fill="#3C1E1E" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z M27.5,30h-7c-0.829,0-1.5-0.672-1.5-1.5v-9C19,18.672,19.671,18,20.5,18h7c0.829,0,1.5,0.672,1.5,1.5v9C29,29.328,28.329,30,27.5,30z"/>
          </svg>
          카카오 로그인
        </button>

        {/* Sign Up Link */}
        <div className="mt-10 text-center">
          <p className="text-base text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-bold text-orange-500 hover:text-orange-600 transition-colors text-lg">
              회원가입
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
