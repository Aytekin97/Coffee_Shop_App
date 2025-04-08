import React, { useContext, useState } from "react";
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';
import "../styles/user-profile-styles/ProfilePage.css"
import anonymous from "../assets/anonymous.png";

const ProfileInfo: React.FC = () => {
  const authContext = useContext<AuthContextType | undefined>(AuthContext);
  const [isEditMode, setEditMode] = useState(false);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user } = authContext;

  // State for date of birth and gender selection
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("Toronto");
  const [homePhone, setHomePhone] = useState("123456798");
  const [postalCode, setPostalCode] = useState("123456");
  const [mobilePhone, setMobilePhone] = useState("123456798");
  return (
    <div className="profile-container">
      <div className="main-profile-info-container">
        {!isEditMode ? (
          <>
            <div className="profile-info-edit-section">
              <h2>Kişisel Bilgileriniz</h2>
              <button 
                className="edit-profile-button" 
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
            <div className="user-profile-info">
              <div className="profile-details-c1">
                <img src={anonymous} alt="Profile" className="profile-image" />
              </div>
              <div className="profile-details-c2">
                <div className="first-name info-box">
                  <h2>İsim:</h2>           
                  <p>{user?.name}</p>
                </div>
                <div className="last-name info-box">
                  <h2>Soyisim:</h2>           
                  <p>Akbulut</p>
                </div>
                <div className="user-email info-box">
                  <h2>Email:</h2>           
                  <p>{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="section-header">
              <h2>Detaylar</h2>
            </div>    
            <div className="user-profile-details">
              <div className="profile-details-c1 birth-year info-box">
                <h2>Doğum Tarihi</h2>             
                <p>{dob || "Belirtilmedi"}</p>
              </div>
              <div className="profile-details-c2 gender-info info-box">
                <h2>Cinsiyet</h2>           
                <p>{gender || "Belirtilmedi"}</p>
              </div>
            </div>

            <div className="section-header">
              <h2>İletişim Bilgileriniz</h2>
            </div>     
            <div className="user-profile-contact">
              <div className="profile-details-c1 city-info info-box">
                <h2>Şehir:</h2>             
                <p>{city}</p> 
              </div>
              <div className="profile-details-c1 home-phone info-box">
                <h2>Ev Telefonu:</h2>             
                <p>{homePhone}</p> 
              </div>
              <div className="profile-details-c2 postal-code info-box">
                <h2>Posta Kodu:</h2>             
                <p>{postalCode}</p> 
              </div>
              <div className="profile-details-c2 mobile-phone info-box">
                <h2>Cep Telefonu:</h2>             
                <p>{mobilePhone}</p> 
              </div>
            </div>
            <div className="button-section">
              <button className="user-delete-button">Hesabımı Sil</button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-info-edit-section">
              <h2>Profili Düzenle</h2>
              <button 
                className="edit-profile-button" 
                onClick={() => setEditMode(false)}
              >
                Kaydet
              </button>
            </div>
            <div className="user-profile-info">
              <div className="profile-details-c1">
                <img src={anonymous} alt="Profile" className="profile-image" />
              </div>
              <div className="profile-details-c2">
                <div className="first-name info-box">
                  <h2>İsim:</h2>           
                  <input type="text" defaultValue={user?.name} className="input-field" />
                </div>
                <div className="last-name info-box">
                  <h2>Soyisim:</h2>           
                  <input type="text" defaultValue="Akbulut" className="input-field" />
                </div>
                <div className="user-email info-box">
                  <h2>Email:</h2>           
                  <input type="email" defaultValue={user?.email} className="input-field" />
                </div>
              </div>
            </div>
            
            <div className="section-header">
              <h2>Detaylar</h2>
            </div>    
            <div className="user-profile-details">
              <div className="profile-details-c1 birth-year info-box">
                <h2>Doğum Tarihi</h2>             
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="dob-input input-field" />
              </div>
              <div className="profile-details-c2 gender-info info-box">
                <h2>Cinsiyet</h2>           
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="gender-select input-field">
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>

            <div className="section-header">
              <h2>İletişim Bilgileriniz</h2>
            </div>     
            <div className="user-profile-contact">
              <div className="profile-details-c1 city-info info-box">
                <h2>Şehir:</h2>             
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" />
              </div>
              <div className="profile-details-c1 home-phone info-box">
                <h2>Ev Telefonu:</h2>             
                <input type="text" value={homePhone} onChange={(e) => setHomePhone(e.target.value)} className="input-field" />
              </div>
              <div className="profile-details-c2 postal-code info-box">
                <h2>Posta Kodu:</h2>             
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input-field" />
              </div>
              <div className="profile-details-c2 mobile-phone info-box">
                <h2>Cep Telefonu:</h2>             
                <input type="text" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} className="input-field" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
