import React, { useRef, useState } from 'react'
import classNames from 'classnames/bind'
import style from './Profilepage.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen } from '@fortawesome/free-solid-svg-icons'
import UpdateUserForm from '~/components/Forms/UpdateUserForm'
import ImageUploader from '~/components/Cloundinary/ImageUploader'
import { Cloudinary } from '@cloudinary/url-gen'
import LoadingModal from '~/components/Modals/LoadingModal'
import ResultModal from '~/components/Modals/ResultModal'

const cx = classNames.bind(style)

function ProfilePage() {

    const [loadingVisible, setLoadingVisible] = useState(false);
    const [result, setResult] = useState({ visible: false, success: false, message: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState('https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

   const handleUpdateClick = () => {
        fileInputRef.current.click(); // mở hộp chọn file
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setIsEditing(true);
        }
    };

    const handleSaveClick = async () => {
        if (!selectedFile) return;

        try {
            // Giả sử API upload của bạn là:
            // POST https://localhost:7176/api/User/upload-avatar
            setLoadingVisible(true);
            const imageUrl = await ImageUploader(selectedFile);
            const response = await fetch('https://localhost:7176/api/User/update-avatar', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl }),
            });
            if (response.ok) {
                console.log('Upload thành công');
                setIsEditing(false);
                setSelectedFile(null);
                setResult({ visible: true, success: true, message: "Ảnh đã được lưu vào cơ sở dữ liệu 🍱" });
            } else {
              setResult({ visible: true, success: false, message: "Oops, hảy thử lại lần nữa!" });
                console.error('Upload thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi upload:', error);
        }
    };

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('title')}>Profile</h1>
      <div className={cx('body-container')}>
        <div className={cx('avt-wrapper')}>
            <div className={cx('username')}>Haijju Moon</div>
            <div className={cx('img-container')}>
                <img src='https://i.pinimg.com/1200x/a6/24/d1/a624d160e5f627d98fc22a442fb0423c.jpg' alt='avatar'/>
            </div>
            {isEditing ? (
                <div className={cx('editImgBtn')} onClick={handleSaveClick}>
                    Save
                </div>
            ) : (
                <div className={cx('editImgBtn')} onClick={handleUpdateClick}>
                    Update Img
                </div>
            )}
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
            <FontAwesomeIcon className={cx('edit-icon')} icon={faUserPen} />
            <UpdateUserForm />
        </div>
      </div>
      <LoadingModal visible={loadingVisible} message="Đang upload ảnh lên nhà hàng Cloudinary..." />
      <ResultModal
        visible={result.visible}
        success={result.success}
        message={result.message}
        onClose={() => setResult((s) => ({ ...s, visible: false }))}
      />
    </div>
  )
}

export default ProfilePage
