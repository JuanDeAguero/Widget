import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Trash2, Edit3, Key, Search, Zap } from 'lucide-react';
import { IconButton } from '../../styles/GlobalStyles';

const DatabaseEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const DatabaseContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const QuerySection = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.header};
  border-top: 1px solid ${props => props.theme.colors.border};
  min-height: 80px;
`;

const QueryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: ${props => props.theme.spacing.xs};
`;

const QueryInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  padding: ${props => props.theme.spacing.xs};
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  
  &:focus {
    outline: none;
  }
`;

const QueryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.accent};
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${props => props.theme.spacing.md};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: 4px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.header};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-size: 12px;
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  background-color: ${props => props.theme.colors.header};
  min-width: 120px;
  width: auto;
`;

const Input = styled.input`
  background: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 12px;
  width: 100%;
  min-width: 80px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const ColumnNameInput = styled(Input)`
  width: 100px;
  min-width: 80px;
  max-width: 120px;
`;

const Select = styled.select`
  background: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 12px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  align-items: center;
`;

const TypeIcon = styled.div<{ type: string }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  margin-right: 4px;
  
  ${props => {
    switch (props.type) {
      case 'string':
        return `background-color: #10b981;`;
      case 'number':
        return `background-color: #3b82f6;`;
      case 'boolean':
        return `background-color: #f59e0b;`;
      case 'date':
        return `background-color: #8b5cf6;`;
      default:
        return `background-color: #6b7280;`;
    }
  }}
`;

interface DatabaseColumn {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  isPrimaryKey: boolean;
  isRequired: boolean;
  defaultValue?: string;
}

interface DatabaseRow {
  id: string;
  [key: string]: any;
}

interface DatabaseEditorProps {
  tableName: string;
}

export const DatabaseEditor: React.FC<DatabaseEditorProps> = () => {  
  const [columns, setColumns] = useState<DatabaseColumn[]>([
    { id: 'id', name: 'id', type: 'string', isPrimaryKey: true, isRequired: true },
    { id: 'name', name: 'name', type: 'string', isPrimaryKey: false, isRequired: true },
    { id: 'email', name: 'email', type: 'string', isPrimaryKey: false, isRequired: false },
    { id: 'created_at', name: 'created_at', type: 'date', isPrimaryKey: false, isRequired: true },
  ]);

  const [rows, setRows] = useState<DatabaseRow[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', created_at: '2025-01-01' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', created_at: '2025-01-02' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', created_at: '2025-01-03' },
  ]);

  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [queryText, setQueryText] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  useEffect(() => {
    const handleAddColumn = () => {
      addColumn();
    };
    
    const handleAddRow = () => {
      addRow();
    };
    
    window.addEventListener('database-add-column', handleAddColumn);
    window.addEventListener('database-add-row', handleAddRow);

    return () => {
      window.removeEventListener('database-add-column', handleAddColumn);
      window.removeEventListener('database-add-row', handleAddRow);
    };
  }, []);

  const addColumn = () => {
    const newColumn: DatabaseColumn = {
      id: `col_${Date.now()}`,
      name: 'new_column',
      type: 'string',
      isPrimaryKey: false,
      isRequired: false,
    };
    setColumns([...columns, newColumn]);
    setEditingColumn(newColumn.id);
  };

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    setRows(rows.map(row => {
      const newRow = { ...row };
      delete newRow[columnId];
      return newRow;
    }));
  };

  const updateColumn = (columnId: string, updates: Partial<DatabaseColumn>) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const addRow = () => {
    const newRow: DatabaseRow = {
      id: `row_${Date.now()}`,
    };
    columns.forEach(col => {
      if (col.id !== 'id') {
        newRow[col.id] = col.defaultValue || '';
      }
    });
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const updateCell = (rowId: string, columnId: string, value: any) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [columnId]: value } : row
    ));
  };

  const handleQuery = async () => {
    if (!queryText.trim()) return;
    
    setIsQuerying(true);

    setTimeout(() => {
      setIsQuerying(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'string': return 'T';
      case 'number': return '#';
      case 'boolean': return 'B';
      case 'date': return 'D';
      default: return '?';
    }
  };

  return (
    <DatabaseEditorContainer>
      <DatabaseContent>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHeaderCell key={column.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {column.isPrimaryKey && <Key size={12} style={{ marginRight: '10px', color: '#f59e0b' }} />}
                        <TypeIcon type={column.type}>
                          {getTypeIcon(column.type)}
                        </TypeIcon>
                        {editingColumn === column.id ? (
                          <ColumnNameInput
                            value={column.name}
                            onChange={(e) => updateColumn(column.id, { name: e.target.value })}
                            onBlur={() => setEditingColumn(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingColumn(null)}
                            autoFocus
                          />
                        ) : (
                          <span 
                            onClick={() => setEditingColumn(column.id)}
                            style={{ cursor: 'pointer', minWidth: '80px', display: 'inline-block' }}
                          >
                            {column.name}
                          </span>
                        )}
                      </div>
                      <ActionButtons>
                        <IconButton 
                          title="Edit Column" 
                          onClick={() => setEditingColumn(column.id)}
                          style={{ padding: '2px' }}
                        >
                          <Edit3 size={10} />
                        </IconButton>
                        {!column.isPrimaryKey && (
                          <IconButton 
                            title="Delete Column" 
                            onClick={() => removeColumn(column.id)}
                            style={{ padding: '2px' }}
                          >
                            <Trash2 size={10} />
                          </IconButton>
                        )}
                      </ActionButtons>
                    </div>
                  </TableHeaderCell>
                ))}
                <TableHeaderCell style={{ width: '60px' }}>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  {columns.map(column => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {editingCell?.rowId === row.id && editingCell?.columnId === column.id ? (
                        column.type === 'boolean' ? (
                          <Select
                            value={row[column.id] || 'false'}
                            onChange={(e) => updateCell(row.id, column.id, e.target.value === 'true')}
                            onBlur={() => setEditingCell(null)}
                            autoFocus
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </Select>
                        ) : (
                          <Input
                            type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                            value={row[column.id] || ''}
                            onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                            autoFocus
                          />
                        )
                      ) : (
                        <span
                          onClick={() => setEditingCell({ rowId: row.id, columnId: column.id })}
                          style={{ cursor: 'pointer', display: 'block', minHeight: '20px' }}
                        >
                          {row[column.id] || ''}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <ActionButtons>
                      <IconButton 
                        title="Delete Row" 
                        onClick={() => removeRow(row.id)}
                        style={{ padding: '2px' }}
                      >
                        <Trash2 size={10} />
                      </IconButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <QuerySection>
          <QueryContainer>
            <Search size={16} color="#8d8d8d" />
            <QueryInput
              type="text"
              placeholder="Write what you want to query... (e.g., 'Show me all users created this month')"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isQuerying}
            />
            <QueryButton onClick={handleQuery} disabled={isQuerying || !queryText.trim()}>
              <Zap size={12} />
              {isQuerying ? 'Querying...' : 'Query'}
            </QueryButton>
          </QueryContainer>
        </QuerySection>
      </DatabaseContent>
    </DatabaseEditorContainer>
  );
};