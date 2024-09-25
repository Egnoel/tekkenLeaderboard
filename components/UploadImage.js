'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const UploadImage = ({ setImages, images }) => {
  const [file, setFile] = useState(null);

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0]; // Atualiza com o arquivo correto
    setFile(selectedFile);

    // Verifique se um arquivo foi selecionado
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'chat app');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dameucg7x/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          setImages(data.secure_url); // Atualiza a URL da imagem
        } else {
          console.error('Erro ao obter URL da imagem:', data);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem no Cloudinary:', error);
      }
    }
  };

  return (
    <div className="flex flex-row items-center gap-1">
      <span>Imagem</span>
      <input type="file" accept="image/*" onChange={handleChange} />
      <div className="flex flex-row gap-1">
        {images && (
          <Image
            src={images}
            alt={`Uploaded image`}
            width={64} // Ajuste o tamanho para ser visível
            height={64}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default UploadImage;
