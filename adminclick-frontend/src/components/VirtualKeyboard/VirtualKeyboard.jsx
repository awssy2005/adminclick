// src/components/VirtualKeyboard/VirtualKeyboard.jsx

const arabicKeys = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ذ'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'],
];

export default function VirtualKeyboard({ onKeyPress, onClose }) {
  return (
    <div
      style={{
        background: '#f1f1f1',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        marginTop: '8px',
      }}
    >
      {arabicKeys.map((row, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              style={{
                margin: '2px',
                padding: '10px 12px',
                fontSize: '18px',
                minWidth: '40px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: 'white',
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            cursor: 'pointer',
            border: 'none',
            background: '#e0e0e0',
            borderRadius: '4px',
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}