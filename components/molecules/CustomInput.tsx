import { UserContext } from '@/contexts/userContext';
import React, { ChangeEvent, useContext, useState } from 'react';

interface SlashTrigger {
  label: string;
  value: string | undefined;
}

interface CustomInputProps {
  rows?: number;
  type?: string;
  placeholder?: string;
  className?: string;
  value: string;
  setValue: (value: string) => void;
  mentions: string[];
  setMentions: Function;
}

function CustomInput({
  rows,
  placeholder,
  className,
  value,
  setValue,
  mentions,
  setMentions,
}: CustomInputProps): JSX.Element {
  const userState: any = useContext(UserContext);
  const [showMentions, setShowMentions] = useState(false);

  const [showSlashTriggers, setShowSlashTriggers] = useState(false);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const lastChar = e.target.value.charAt(e.target.value.length - 1);
    setShowMentions(lastChar === '@');
    setShowSlashTriggers(lastChar === '/');
  }

  return (
    <div className='relative'>
      <textarea
        rows={rows ?? 2}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
        required={true}
      />
      {showMentions && (
        <div className='absolute bottom-0 left-0 translate-y-full w-full scrollbar scrollbar-w-1 scrollbar-thumb-vapormintBlack-200 rounded-md shadow-lg bg-vapormintWhite-200/20 backdrop-blur-md text-brand1 text-base font-medium z-[9999] flex flex-col h-48 overflow-auto'>
          <span className='px-4 py-2 text-lg font-bold'>Following</span>
          {userState.userData.followee_count.map((x: string, index: number) => (
            <div
              key={index}
              onClick={() => {
                setValue(`${value}${x}`);
                setMentions([...mentions, x]);
                setShowMentions(false);
              }}
              className='w-full px-4 py-2 cursor-pointer text-brand1 hover:bg-vapormintBlack-200/20 hover:backdrop-blur-md'
            >
              {x}
            </div>
          ))}
        </div>
      )}
      {showSlashTriggers && (
        <div className='absolute bottom-0 left-0 translate-y-full w-full scrollbar scrollbar-w-1 scrollbar-thumb-vapormintBlack-200 rounded-md shadow-lg bg-vapormintWhite-200/20 backdrop-blur-md text-brand1 text-base font-medium z-[9999] flex flex-col h-48 overflow-auto'>
          {[
            {
              label: 'Email',
              value: userState.userData.email,
            },
            {
              label: 'Name',
              value: userState.userData.name,
            },
            {
              label: 'Username',
              value: userState.userData.username,
            },
            {
              label: 'Solana Wallet',
              value: userState.userData.wallet_id,
            },
            {
              label: 'EVM Wallet',
              value: userState.userData.evm_wallet_id,
            },
          ].map((x: SlashTrigger, index: number) => (
            <div
              key={index}
              onClick={() => {
                setValue(`${value.slice(0, -1)}${x.value}`);
                setShowSlashTriggers(false);
              }}
              className='w-full px-4 py-2 cursor-pointer text-brand1 hover:bg-vapormintBlack-200/20 hover:backdrop-blur-md'
            >
              {x.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomInput;
