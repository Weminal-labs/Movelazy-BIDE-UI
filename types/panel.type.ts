export type PanelType = 'explorer' | 'extensions' | 'search' | 'git' | 'compiler' | 'deployer';

export interface Panel {
  id: PanelType;
  icon: React.ReactNode;
  title: string;
  component: React.ReactNode;
}