import * as React from 'react';

interface Props {
  className?: string;
}

export const RIDIPayIcon: React.SFC<Props> = (props) => {
  const { className = '' } = props;
  return (
    <svg viewBox="0 0 163 48" className={`ridi_icon ${className}`}>
      <path d='M19.697 28.057c3.499-1.67 5.275-5.027 5.279-9.98.003-4.462-1.019-7.618-3.04-9.379-2.044-1.781-5.426-2.686-10.052-2.689L1.124 6c-.801-.001-1.1.297-1.1 1.099L0 38.835c-.001.802.298 1.1 1.099 1.1l6.545.005c.802.001 1.101-.297 1.102-1.099l.007-8.873v-.391h.391l1.806.001h.246l.106.221 4.359 9.087c.36.721.933 1.059 1.803 1.06l6.645.005c.559 0 .646-.195.678-.268.105-.239.053-.56-.155-.953l-5.295-10.052-.189-.36.366-.176zm-4.555-6.505c-.642.743-1.775 1.118-3.369 1.117l-2.625-.002h-.391v-.391l.006-8.474v-.391h.391l2.625.002c1.61.001 2.709.349 3.358 1.062.636.696.946 1.872.944 3.594-.001 1.616-.308 2.755-.939 3.483zM37.835 6.028l-6.595-.005c-.802-.001-1.101.298-1.102 1.099l-.024 31.735c-.001.802.298 1.1 1.1 1.101l6.595.005c.801.001 1.099-.298 1.099-1.099l.024-31.735c.001-.802-.296-1.101-1.097-1.101zM55.392 6.041l-9.669-.007c-.801-.001-1.1.298-1.1 1.099l-.024 31.735c-.001.802.298 1.1 1.099 1.101l9.769.007c5.026.004 8.716-1.271 10.97-3.788 2.273-2.536 3.428-6.967 3.432-13.168.005-6.202-1.152-10.634-3.435-13.172-2.268-2.523-5.982-3.803-11.042-3.807zm4.344 24.278c-.873 1.364-2.391 2.054-4.512 2.052l-1.435-.001h-.391v-.391l.013-17.945v-.391h.391l1.337.001c2.116.002 3.646.692 4.551 2.051.866 1.301 1.286 3.694 1.283 7.318-.001 3.618-.407 6.008-1.237 7.306zM82.784 6.061l-6.596-.005c-.802-.001-1.1.298-1.101 1.099l-.024 31.735c-.001.802.297 1.1 1.099 1.101l6.596.005c.801.001 1.098-.298 1.099-1.099l.024-31.735c.001-.801-.296-1.1-1.097-1.101zM129.294 13.987c-3.024-.002-6.388.704-8.565 1.798-.534.246-.782.759-.645 1.346l.577 2.01c.164.528.546.843 1.023.843.136 0 .273-.027.441-.089 1.584-.733 3.8-1.575 6.899-1.572 3.895.003 5.482 1.515 5.479 5.22l-.001.892c-9.711.282-16.171 1.893-16.176 8.765-.003 4.54 3.122 7.363 8.156 7.366 3.563.003 6.353-1.178 8.099-3.42l-.001 1.829c-.001.753.396 1.168 1.117 1.169l1.994.001c.738.001 1.162-.443 1.163-1.215l.012-15.529c.005-6.417-3.036-9.409-9.572-9.414zm5.205 16.033c-.003 3.95-2.905 6.499-7.393 6.496-2.726-.002-4.419-1.326-4.417-3.456.003-3.819 4.889-4.372 11.811-4.708zM145.776 47.631c-.151.056-.308.104-.466.154a5.862 5.862 0 0 1-.947.2c-.387.055-.68-.017-.758-.571l-.493-3.248c-.078-.553.12-.751.618-.821.332-.047.941-.068 1.39-.161 1.904-.393 3.904-1.847 4.896-3.907.234-.486.25-1.051.057-1.555L142.2 15.986c-.144-.39-.12-.754.067-1.024.177-.254.478-.393.848-.393l2.348.002c.866.001 1.098.752 1.185 1.035l4.415 12.514 1.878 6.035c.005.017.03.017.035 0l1.698-6.004 3.732-12.531c.088-.285.322-1.038 1.189-1.038l2.348.002c.459 0 .708.203.836.372.138.182.273.506.131 1.013l-1.729 5.707c-2.13 7.03-3.655 14.575-8.172 20.598-1.806 2.408-4.41 4.304-7.233 5.357zM103.151 6.045l-9.282-.007c-.651 0-1.024.409-1.025 1.124l-.024 31.737c-.001.725.378 1.125 1.067 1.125l2.298.002c.659 0 1.068-.43 1.069-1.124l.007-9.865 5.872.004c9.173.007 13.265-3.261 13.272-11.464.006-8.236-4.082-11.525-13.254-11.532zm-.014 18.61l-5.872-.004.011-14.222 5.872.004c6.29.005 8.74 1.728 8.736 7.142-.005 5.378-2.457 7.084-8.747 7.08z'/>
    </svg>
  );
};