'use client';
import Button from '@/components/molecules/Button';
import Divider from '@/components/molecules/Divider';
import TextInput from '@/components/molecules/TextInput';
import { useState, useEffect } from 'react';

type Props = {
  question: string;
  options: string[];
  setQuestion: Function;
  setOptions: Function;
};

export default function PollInput(props: Props) {
  const [question, setQuestion] = useState(props.question);
  const [options, setOptions] = useState<string[]>(props.options);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number>(-1);

  useEffect(() => {
    props.setQuestion(question);
  }, [question]);
  useEffect(() => {
    props.setOptions(options);
  }, [options]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      if (editIndex !== -1) {
        // Edit existing todo
        const updatedoptions = [...options];
        updatedoptions[editIndex] = inputValue;
        setOptions(updatedoptions);
        setEditIndex(-1);
      } else if (options.length < 4) {
        // Add new todo
        setOptions([...options, inputValue]);
      }
      setInputValue('');
    }
  };

  const handleEditTodo = (index: number) => {
    setInputValue(options[index]);
    setEditIndex(index);
  };

  const handleRemoveTodo = (index: number) => {
    const updatedoptions = options.filter((_, i) => i !== index);
    setOptions(updatedoptions);
    if (editIndex === index) {
      setEditIndex(-1);
      setInputValue('');
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <input
        className={`w-full  text-xl font-bold rounded-none px-4 py-5 text-vapormintWhite-100 bg-vapormintBlack-300 focus:outline-none `}
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
        placeholder={'Type question here...'}
      />
      <Divider kind='solid' size={1} />

      <ul>
        {options.map((todo, index) => (
          <div key={index}>
            <li className='flex items-center justify-between w-full px-4 py-3 text-base font-semibold text-vapormintWhite-100'>
              {todo}
              <svg
                onClick={() => handleEditTodo(index)}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5 ml-auto mr-2 cursor-pointer text-vapormintWarning-500'>
                <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z' />
              </svg>

              <svg
                onClick={() => handleRemoveTodo(index)}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 cursor-pointer text-vapormintError-500'>
                <path
                  fillRule='evenodd'
                  d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                  clipRule='evenodd'
                />
              </svg>
            </li>
            <Divider kind='center' size={1} />
          </div>
        ))}
      </ul>
      <div className='w-full px-4'>
        <TextInput
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Type a option here'
        />
      </div>
      <Button
        handleClick={handleAddTodo}
        kind='success'
        size='base'
        type='ghost'>
        {editIndex !== -1
          ? 'Update'
          : options.length >= 4
          ? 'Max 4 options'
          : 'Add'}
      </Button>
    </div>
  );
}
