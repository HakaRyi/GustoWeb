// import React, { useEffect, useRef, useState } from 'react';
// import classNames from 'classnames/bind';
// import style from './Profilepage.module.scss';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUserPen } from '@fortawesome/free-solid-svg-icons';
// import UpdateUserForm from '~/components/Forms/UpdateUserForm';
// import LoadingModal from '~/components/Modals/LoadingModal';
// import ResultModal from '~/components/Modals/ResultModal';
// import { customFetch } from '~/config/customFetch';

// const cx = classNames.bind(style);

// function ProfilePage() {
//     const [loadingVisible, setLoadingVisible] = useState(false);
//     const [result, setResult] = useState({ visible: false, success: false, message: '' });
//     const [isEditing, setIsEditing] = useState(false);
//     const [preview, setPreview] = useState('https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg');
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [profileData, setProfileData] = useState(null);
//     const fileInputRef = useRef(null);

//     //Lấy dữ liệu người dùng:
//     const fetchProfile = async () => {
//         try {
//             setLoadingVisible(true);
//             const response = await customFetch('https://localhost:7176/api/Account/get-me', {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//             });
//             if (!response.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
//             const data = await response.json();
//             setProfileData(data);
//             console.log(data);
//             setPreview(
//                 data.avatarUrl && data.avatarUrl.trim() !== ''
//                     ? data.avatarUrl
//                     : 'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg',
//             );
//         } catch (error) {
//             console.error('Error fetching profile:', error);
//             setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
//         } finally {
//             setLoadingVisible(false);
//             setIsEditing(false);
//         }
//     };
//     useEffect(() => {
//         //gọi hàm
//         fetchProfile();
//     }, []);

//     const handleUpdateClick = () => {
//         fileInputRef.current.click(); // mở hộp chọn file
//     };

//     const handleFileChange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setPreview(URL.createObjectURL(file));
//         }
//     };

//     const toggleEditMode = () => {
//         setIsEditing(!isEditing);
//     };

//     return (
//         <div className={cx('wrapper')}>
//             <h1 className={cx('title')}>Profile</h1>
//             <div className={cx('body-container')}>
//                 <div className={cx('avt-wrapper')}>
//                     <input
//                         type="text"
//                         className={cx('username')}
//                         value={profileData?.fullName || ''}
//                         disabled={!isEditing}
//                         onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
//                     />

//                     <div className={cx('img-container')}>
//                         <img src={preview} alt="avatar" />
//                     </div>
//                     <div
//                         className={cx('editImgBtn')}
//                         onClick={handleUpdateClick}
//                         style={{ visibility: isEditing ? 'visible' : 'hidden' }}
//                     >
//                         Update Img
//                     </div>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         ref={fileInputRef}
//                         onChange={handleFileChange}
//                         style={{ display: 'none' }}
//                     />
//                 </div>

//                 <div className={cx('infor-wrapper')}>
//                     <div className={cx('infor-title')}>Bio and other information</div>
//                     <FontAwesomeIcon
//                         className={cx('edit-icon')}
//                         icon={faUserPen}
//                         onClick={toggleEditMode}
//                         style={{ color: isEditing ? 'red' : 'white' }}
//                     />
//                     <UpdateUserForm
//                         initialValues={profileData}
//                         onProfileReload={fetchProfile}
//                         isEditing={isEditing}
//                         imgFile={selectedFile}
//                     />
//                 </div>
//             </div>
//             <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
//             <ResultModal
//                 visible={result.visible}
//                 success={result.success}
//                 message={result.message}
//                 onClose={() => setResult((s) => ({ ...s, visible: false }))}
//             />
//         </div>

//         <div className={cx('infor-wrapper')}>
//             <div className={cx('infor-title')}>Bio and other information</div>
//             <FontAwesomeIcon className={cx('edit-icon')} icon={faUserPen} />
//             <UpdateUserForm initialValues={profileData} onProfileReload={fetchProfile} />
//         </div>
//       </div>
//       <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
//       <ResultModal
//         visible={result.visible}
//         success={result.success}
//         message={result.message}
//         onClose={() => setResult((s) => ({ ...s, visible: false }))}
//       />
//     </div>

//   )
// }

// export default ProfilePage;
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Profilepage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import UpdateUserForm from '~/components/Forms/UpdateUserForm';
import LoadingModal from '~/components/Modals/LoadingModal';
import ResultModal from '~/components/Modals/ResultModal';
import { customFetch } from '~/config/customFetch';

const cx = classNames.bind(style);

function ProfilePage() {
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState('https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg');
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const fileInputRef = useRef(null);
    const [initialData, setInitialData] = useState(null);

    // Lấy dữ liệu người dùng:
    const fetchProfile = async () => {
        try {
            setLoadingVisible(true);
            const response = await customFetch('https://gustoweb.onrender.com/api/Account/get-me', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) setResult({ visible: true, success: false, message: 'Lấy dữ liệu không thành công' });
            const data = await response.json();
            setProfileData(data);
            setInitialData(data);
            console.log(data);
            setPreview(
                data.avatarUrl && data.avatarUrl.trim() !== ''
                    ? data.avatarUrl
                    : 'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg',
            );
        } catch (error) {
            console.error('Error fetching profile:', error);
            setResult({ visible: true, success: false, message: 'Không thể tải thông tin người dùng 😢' });
        } finally {
            setLoadingVisible(false);
            setIsEditing(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setProfileData(initialData); // Khôi phục dữ liệu gốc
        setPreview(
            initialData.avatarUrl && initialData.avatarUrl.trim() !== ''
                ? initialData.avatarUrl
                : 'https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg',
        ); // Khôi phục ảnh preview
        setSelectedFile(null);
        setIsEditing(false);
    };

    useEffect(() => {
        // Gọi hàm
        fetchProfile();
    }, []);

    const handleUpdateClick = () => {
        fileInputRef.current.click(); // Mở hộp chọn file
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <h1 className={cx('title')}>Profile</h1>
                <div className={cx('body-container')}>
                    <div className={cx('avt-wrapper')}>
                        <input
                            type="text"
                            className={cx('username')}
                            value={profileData?.fullName || ''}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        />
                        <div className={cx('img-container')}>
                            <img src={preview} alt="avatar" />
                        </div>
                        <div
                            className={cx('editImgBtn')}
                            onClick={handleUpdateClick}
                            style={{ visibility: isEditing ? 'visible' : 'hidden' }}
                        >
                            Update Img
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className={cx('infor-wrapper')}>
                        <div className={cx('infor-title')}>Bio and other information</div>
                        <FontAwesomeIcon
                            className={cx('edit-icon')}
                            icon={faUserPen}
                            onClick={toggleEditMode}
                            style={{ color: isEditing ? 'red' : 'white' }}
                        />
                        <UpdateUserForm
                            initialValues={profileData}
                            onProfileReload={fetchProfile}
                            isEditing={isEditing}
                            imgFile={selectedFile}
                        />
                    </div>
                </div>
            </div>
            <LoadingModal visible={loadingVisible} message="Bếp đang nấu, vui lòng chờ..." />
            <ResultModal
                visible={result.visible}
                success={result.success}
                message={result.message}
                onClose={() => setResult((s) => ({ ...s, visible: false }))}
            />
        </>
    );
}

export default ProfilePage;
