import React, { ReactElement } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Divider from './Divider';

interface AutoCompleteProps {
  title?: String;
  error?: String;
  optional?: boolean;

  items: any[];
  showIcon: boolean;
  placeholder: string;
  dark: boolean;
  setValue: (value: string) => void;
}

function AutoComplete(props: AutoCompleteProps): ReactElement {
  const handleOnSearch = (string: string, results: any[]): void => {
    console.log(string, results);
  };

  const handleOnSelect = (item: any): void => {
    props.setValue(item.name);
    console.log(item);
  };

  const handleOnFocus = (): void => {
    console.log('Focused');
  };

  const formatResult = (item: any): React.ReactNode => {
    return (
      <>
        <span
          style={{ cursor: 'pointer', display: 'block', textAlign: 'left' }}
        >
          {item.name}
        </span>
      </>
    );
  };

  return (
    <>
      {props.title && (
        <span className='text-xs font-semibold tracking-widest uppercase text-vapormintWhite-100'>
          {props.title}{' '}
          {props.optional && (
            <span className='text-xs font-semibold tracking-widest uppercase text-vapormintBlack-200'>
              optional
            </span>
          )}
        </span>
      )}
      <ReactSearchAutocomplete
        items={props.items}
        onSearch={handleOnSearch}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        formatResult={formatResult}
        showIcon={props.showIcon}
        placeholder={props.placeholder}
        styling={{
          height: '36px',
          borderRadius: '0px',
          border: '0px solid ',
          backgroundColor: 'black',
          boxShadow: 'none',
          hoverBackgroundColor: '#434343',
          color: 'white',
          fontSize: '16px',
          iconColor: 'white',
          lineColor: 'white',
          placeholderColor: '#7B7B7B',
          clearIconMargin: '2px 8px 0 0',
          zIndex: 40,
        }}
      />{' '}
      {props.error && (
        <span className='text-sm tracking-wider text-vapormintError-500 '>
          {props.error}
        </span>
      )}
      <Divider kind='solid' size={1} />
    </>
  );
}

export default AutoComplete;
