/**
 * @file firebase.js
 * @description Firebase 설정 및 초기화 파일
 * 
 * Firebase 서비스들을 초기화하고 앱 전체에서 사용할 수 있도록 export합니다.
 * 사용되는 Firebase 서비스:
 * - Authentication: Google 소셜 로그인
 * - Firestore: 사용자 플레이리스트 및 메모 저장
 */

// Firebase 앱 초기화 함수
import { initializeApp } from "firebase/app";

// Firebase Authentication 관련 import
// - getAuth: 인증 서비스 인스턴스 가져오기
// - GoogleAuthProvider: Google 로그인 제공자
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firestore 데이터베이스 서비스
import { getFirestore } from "firebase/firestore";

/**
 * Firebase 프로젝트 설정
 * 
 * ⚠️ 주의: 실제 프로덕션에서는 환경 변수로 관리해야 합니다!
 * 
 * 설정값 얻는 방법:
 * 1. Firebase Console (https://console.firebase.google.com) 접속
 * 2. 프로젝트 선택 → 프로젝트 설정 (톱니바퀴 아이콘)
 * 3. '내 앱' 섹션에서 웹 앱 선택
 * 4. SDK 설정 및 구성에서 복사
 */
const firebaseConfig = {
    // Firebase API 키 (공개되어도 되지만, Firestore 규칙으로 보안 유지)
    apiKey: "AIzaSyCc0oeLi0tTtdR1jLlceImt5QegHnsmpYA",

    // 인증 도메인 (Google 로그인 리다이렉트에 사용)
    authDomain: "ossspotify-6f04c.firebaseapp.com",

    // Firebase 프로젝트 고유 ID
    projectId: "ossspotify-6f04c",

    // Cloud Storage 버킷 URL (현재 미사용)
    storageBucket: "ossspotify-6f04c.firebasestorage.app",

    // Firebase Cloud Messaging 발신자 ID (현재 미사용)
    messagingSenderId: "1067160469050",

    // 웹 앱 고유 ID
    appId: "1:1067160469050:web:d7e232e69c941b8fc87f03",

    // Google Analytics 측정 ID (현재 미사용)
    measurementId: "G-D102H0TSBF"
};

/**
 * Firebase 앱 초기화
 * 
 * initializeApp()은 Firebase 서비스들을 사용하기 전에 반드시 호출해야 합니다.
 * 반환된 app 객체는 다른 서비스 초기화에 사용됩니다.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication 인스턴스
 * 
 * 사용 예시:
 * - onAuthStateChanged(auth, callback): 로그인 상태 변화 감지
 * - signInWithPopup(auth, googleProvider): Google 팝업 로그인
 * - signOut(auth): 로그아웃
 */
export const auth = getAuth(app);

/**
 * Google 로그인 제공자
 * 
 * signInWithPopup()이나 signInWithRedirect()와 함께 사용하여
 * Google 계정으로 로그인할 수 있게 해줍니다.
 * 
 * 사용 전 Firebase Console에서 Google 로그인을 활성화해야 합니다:
 * Authentication → Sign-in method → Google → 사용 설정
 */
export const googleProvider = new GoogleAuthProvider();

/**
 * Firestore 데이터베이스 인스턴스
 * 
 * 사용 예시:
 * - doc(db, "collection", "docId"): 문서 참조 생성
 * - getDoc(docRef): 문서 읽기
 * - setDoc(docRef, data): 문서 생성/덮어쓰기
 * - updateDoc(docRef, data): 문서 일부 업데이트
 * 
 * 데이터 구조:
 * users/{userId}
 *   - playlist: Array<Track>  // 사용자 플레이리스트
 *   - memos: { trackId: string }  // 곡별 메모
 */
export const db = getFirestore(app);

// 기본 export로 app 객체 내보내기 (필요한 경우 사용)
export default app;
