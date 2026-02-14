# Design System - Factureo

## 📋 Vue d'ensemble

Ce design system fournit une base cohérente pour le développement de l'application Factureo. Il comprend les couleurs, la typographie, les espacements, et les règles de layout.

## 🎨 Couleurs

### Palette principale

```typescript
import { colors } from './theme';

// Couleurs primaires
colors.primary.main      // #FF3EFF (Magenta principal)
colors.secondary.main    // #002A61 (Bleu marine)
colors.tertiary.main     // #803DFF (Violet)

// Background avec dégradé
colors.background.gradient.start  // #002A61
colors.background.gradient.end    // #FF3EFF
```

### Utilisation

```typescript
// Dans un StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.main,
  },
});

// Pour le dégradé, utilisez le composant GradientBackground
<GradientBackground>
  {/* Votre contenu */}
</GradientBackground>
```

## 📝 Typographie

### Variantes disponibles

- **h1 à h6** : Titres (Bold par défaut)
- **subtitle1, subtitle2** : Sous-titres (Inter Medium)
- **body1, body2** : Corps de texte (Inter Regular)
- **button** : Texte des boutons (Inter Semibold)
- **caption** : Petits textes
- **overline** : Texte en majuscules

### Utilisation

```typescript
import { Text } from './components';

<Text variant="h1" color="inverse">FACTUREO</Text>
<Text variant="body1" color="secondary">Corps du texte</Text>
<Text variant="caption">Petite note</Text>
```

### Propriétés du composant Text

```typescript
interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 
            'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 
            'button' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'disabled' | 'inverse' | 
          'error' | 'success' | 'warning';
  centered?: boolean;
  bold?: boolean;
  italic?: boolean;
}
```

## 📏 Spacing

### Échelle d'espacement (base 4px)

```typescript
import { spacing } from './theme';

spacing.xs     // 4px
spacing.sm     // 8px
spacing.md     // 12px
spacing.base   // 16px
spacing.lg     // 20px
spacing.xl     // 24px
spacing['2xl'] // 32px
spacing['3xl'] // 40px
spacing['4xl'] // 48px
// ... jusqu'à 8xl
```

### Espacements sémantiques

```typescript
import { semanticSpacing } from './theme';

// Padding des containers
semanticSpacing.containerPadding.horizontal  // 32px
semanticSpacing.containerPadding.vertical    // 24px

// Padding des sections
semanticSpacing.sectionPadding.horizontal    // 16px
semanticSpacing.sectionPadding.vertical      // 32px

// Espacement entre éléments
semanticSpacing.elementSpacing.tight         // 4px
semanticSpacing.elementSpacing.normal        // 12px
semanticSpacing.elementSpacing.relaxed       // 20px
semanticSpacing.elementSpacing.loose         // 32px
```

## 🎭 Layout

### Border Radius

```typescript
import { borderRadius } from './theme';

borderRadius.xs    // 4px
borderRadius.sm    // 8px
borderRadius.md    // 12px
borderRadius.lg    // 16px
borderRadius.xl    // 20px
borderRadius.full  // 9999px (cercle)
```

### Shadows

```typescript
import { shadows } from './theme';

shadows.none  // Pas d'ombre
shadows.sm    // Ombre légère
shadows.md    // Ombre moyenne
shadows.lg    // Ombre prononcée
shadows.xl    // Ombre très prononcée
```

### Hauteurs prédéfinies

```typescript
import { heights } from './theme';

heights.button.small   // 36px
heights.button.medium  // 44px
heights.button.large   // 56px

heights.input.small    // 36px
heights.input.medium   // 44px
heights.input.large    // 56px
```

## 🧩 Composants

### GradientBackground

Composant pour afficher le dégradé de fond selon le design system.

```typescript
import { GradientBackground } from './components';

<GradientBackground direction="vertical">
  {/* Contenu */}
</GradientBackground>
```

**Props:**
- `direction?: 'vertical' | 'horizontal' | 'diagonal'` (défaut: 'vertical')

### Button

Composant bouton avec plusieurs variantes.

```typescript
import { Button } from './components';

<Button
  title="CRÉER UN COMPTE"
  variant="primary"
  size="large"
  fullWidth
  onPress={() => {}}
/>
```

**Props:**
- `title: string` (requis)
- `variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost'`
- `size?: 'small' | 'medium' | 'large'`
- `loading?: boolean`
- `disabled?: boolean`
- `fullWidth?: boolean`
- `leftIcon?: React.ReactNode`
- `rightIcon?: React.ReactNode`

### Text

Composant texte typé avec le design system.

```typescript
import { Text } from './components';

<Text variant="h1" color="inverse" centered>
  Mon Titre
</Text>
```

## 📱 Exemple d'utilisation complète

```typescript
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { GradientBackground, Text, Button } from './components';
import { spacing, semanticSpacing } from './theme';

export default function MyScreen() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text variant="h1" color="inverse" centered>
            FACTUREO
          </Text>
          
          <Text variant="h2" color="inverse" centered>
            GÉREZ VOS FACTURES SIMPLEMENT
          </Text>
          
          <Button
            title="COMMENCER"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => {}}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: semanticSpacing.containerPadding.horizontal,
    paddingVertical: spacing['4xl'],
    gap: spacing.xl,
  },
});
```

## 🎯 Bonnes pratiques

1. **Toujours utiliser les tokens du design system** plutôt que des valeurs en dur
2. **Privilégier les espacements sémantiques** pour une cohérence
3. **Utiliser les composants fournis** (Text, Button, etc.) au lieu des composants natifs
4. **Respecter la hiérarchie typographique** (h1 > h2 > h3, etc.)
5. **Utiliser les couleurs appropriées** selon le contexte (primary, secondary, etc.)

## 🔄 Évolution

Ce design system est évolutif. Les polices Inter et Poppins actuelles sont temporaires et seront remplacées par les polices définitives du projet.

Pour ajouter de nouvelles variantes ou composants, suivez la structure existante et maintenez la cohérence avec le système actuel.
