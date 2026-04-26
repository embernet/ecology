/**
 * Resource ID type prefixes.
 * Each resource type has a single-letter prefix followed by a sequential number.
 *
 * n = NatureExample  (e.g. n1, n2, n3)
 * a = Activity       (e.g. a1, a2, a3)
 * r = Reflection     (e.g. r1, r2, r3)
 * q = Requirement    (e.g. q1, q2, q3)
 * t = Note           (e.g. t1, t2, t3)
 * g = Guidance       (e.g. g1, g2, g3)
 * s = ActivitySheet  (e.g. s1, s2, s3)
 *
 * IDs are assigned explicitly in content MDX files and must be globally unique.
 * The build script (scripts/build-resource-registry.mjs) validates uniqueness.
 */
export const RESOURCE_TYPE_PREFIXES: Record<string, string> = {
  NatureExample: 'n',
  Activity: 'a',
  Reflection: 'r',
  Requirement: 'q',
  Note: 't',
  Guidance: 'g',
  ActivitySheet: 's',
};
