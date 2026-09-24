import { NatureExample } from '@/components/mdx/NatureExample';
import { Habitat } from '@/components/mdx/Habitat';
import { Creature } from '@/components/mdx/Creature';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { TaxonomicKey } from '@/components/mdx/TaxonomicKey';
import { FieldNotebookTemplate } from '@/components/mdx/FieldNotebookTemplate';
import { ExternalResource } from '@/components/mdx/ExternalResource';

// A central registry for all dynamic resource components
export const ResourceComponents: Record<string, React.FC<any>> = {
  NatureExample,
  Habitat,
  Creature,
  Requirement,
  Activity,
  Reflection,
  Note,
  Guidance,
  TaxonomicKey,
  FieldNotebookTemplate,
  ExternalResource,
};
