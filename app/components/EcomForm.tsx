'use client';
 
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
 
export default function EcomForm() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputWalletRef = useRef<HTMLInputElement>(null);
  const inputPriceRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const {primaryWallet} = useDynamicContext();
  return (
    <>
      <h1>Upload Your Avatar</h1>
 
      <form
        onSubmit={async (event) => {
          event.preventDefault();
 
          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }
          if (!inputWalletRef.current?.value) {
            throw new Error('No wallet address provided');
          }
          if (!inputPriceRef.current?.value) {
            throw new Error('No price provided');
          }
 
          const file = inputFileRef.current.files[0];
 
          const blob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/form/upload',
          });
          setBlob(blob);

          const postData = {
            imageUrl: blob.url,
            receivingWallet: inputWalletRef.current.value,
            price: inputPriceRef.current.value,
            ownerWallet: primaryWallet?.address,
          };
    
          await fetch('/api/form/uploadFrame', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <h1>Set Wallet Address</h1>
        <input type="text" id="wallet" name="wallet" ref={inputWalletRef}></input>
        <h1>Set Product Price in ETH</h1>
        <input type="text" id="price" name="price" ref={inputPriceRef}></input>
        <button type="submit">Submit</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}