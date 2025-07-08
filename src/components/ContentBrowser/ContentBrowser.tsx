import styled from 'styled-components';
import { FileText, Image, Folder, Plus, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Panel, PanelHeader, PanelContent, IconButton } from '../../styles/GlobalStyles';
import type { Asset, WidgetBlueprint } from '../../types';

const ContentBrowserContainer = styled(Panel)`
  height: ${props => props.theme.sizes.contentBrowserHeight};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ContentHeader = styled(PanelHeader)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  padding: ${props => props.theme.spacing.xs};
  max-width: 200px;
  margin-left: auto;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  flex: 1;
  margin-left: ${props => props.theme.spacing.xs};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:active {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ItemName = styled.div`
  font-size: 10px;
  text-align: center;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  line-height: 1.2;
`;

interface ContentBrowserProps {
  isOpen: boolean;
}

export function ContentBrowser({ isOpen }: ContentBrowserProps) {
  const { state } = useApp();

  if (!isOpen) return null;

  const getIcon = (item: Asset | WidgetBlueprint) => {
    if ('type' in item) {
      switch (item.type) {
        case 'image':
          return <Image size={20} />;
        case 'icon':
          return <Image size={20} />;
        case 'blueprint':
          return <FileText size={20} />;
        default:
          return <Folder size={20} />;
      }
    } else {
      return <FileText size={20} />;
    }
  };

  return (
    <ContentBrowserContainer>
      <ContentHeader>
        Content Browser
        <SearchContainer>
          <Search size={14} color="#8d8d8d" />
          <SearchInput placeholder="Search assets..." />
        </SearchContainer>
        <IconButton title="Add Asset">
          <Plus size={14} />
        </IconButton>
      </ContentHeader>

      <PanelContent>
        <ContentGrid>
          {state.project.blueprints.map((blueprint) => (
            <ContentItem key={blueprint.id}>
              <ItemIcon>
                {getIcon(blueprint)}
              </ItemIcon>
              <ItemName>{blueprint.name}</ItemName>
            </ContentItem>
          ))}
          
          {state.project.assets.map((asset) => (
            <ContentItem key={asset.id}>
              <ItemIcon>
                {getIcon(asset)}
              </ItemIcon>
              <ItemName>{asset.name}</ItemName>
            </ContentItem>
          ))}
        </ContentGrid>
      </PanelContent>
    </ContentBrowserContainer>
  );
}
