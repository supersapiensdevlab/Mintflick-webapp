import { useClipboard } from '@mantine/hooks';
import React, { useState } from 'react';

function CopyToClipboard(props: {
  className: string;
  text: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const clipboard = useClipboard({ timeout: 1000 });

  return (
    <div className={props.className} onClick={() => clipboard.copy(props.text)}>
      {props.title ? props.title : ''} {clipboard.copied ? 'Copied' : 'Copy'}{' '}
    </div>
  );
}

export default CopyToClipboard;
