# 📚 Exemples d'Utilisation du Design System

Ce dossier contient des exemples complets d'écrans utilisant le design system de Factureo.

## 📁 Fichiers Disponibles

### 1. WelcomeScreen.example.tsx
Écran de bienvenue avec dégradé

**Démontre :**
- Utilisation du composant `GradientBackground`
- Typographie avec variantes (h1, h2, body1, caption)
- Boutons primary et outline
- Layout avec flex et spacing

### 2. LoginScreen.example.tsx
Écran de connexion avec formulaire

**Démontre :**
- Composants `Input` avec validation
- Gestion des états (loading, error)
- KeyboardAvoidingView pour mobile
- Formulaire complet avec UX optimale

### 3. DashboardScreen.example.tsx
Écran tableau de bord

**Démontre :**
- Composants `Card` avec différentes variantes
- Grilles et layouts complexes
- Badges et statistiques
- ScrollView avec sections

## 🚀 Comment Utiliser ces Exemples

### Option 1 : Copier-Coller
Copiez le code de l'exemple qui vous intéresse et adaptez-le à vos besoins.

### Option 2 : Import Direct
Importez l'exemple dans votre App.tsx pour le tester :

```typescript
import WelcomeScreenExample from './examples/WelcomeScreen.example';

export default function App() {
  return <WelcomeScreenExample />;
}
```

### Option 3 : Utiliser comme Base
Utilisez les exemples comme point de départ pour créer vos propres écrans.

## 💡 Patterns Communs

### Pattern 1 : Écran avec Dégradé
```typescript
<GradientBackground>
  <SafeAreaView style={styles.container}>
    <Container padding="container">
      {/* Contenu */}
    </Container>
  </SafeAreaView>
</GradientBackground>
```

### Pattern 2 : Écran avec Background Simple
```typescript
<SafeAreaView style={styles.container}>
  <Container padding="section">
    <ScrollView>
      {/* Contenu */}
    </ScrollView>
  </Container>
</SafeAreaView>
```

### Pattern 3 : Formulaire avec Validation
```typescript
const [value, setValue] = useState('');
const [error, setError] = useState('');

<Input
  label="Email"
  value={value}
  onChangeText={(text) => {
    setValue(text);
    setError(''); // Clear error on change
  }}
  error={error}
  required
/>
```

### Pattern 4 : Liste avec Cards
```typescript
<ScrollView>
  {items.map((item) => (
    <Card key={item.id} variant="outlined" padding="medium">
      {/* Contenu de la carte */}
    </Card>
  ))}
</ScrollView>
```

## 🎨 Customisation

Tous ces exemples utilisent le design system. Pour modifier l'apparence :

1. **Couleurs** : Modifiez `theme/colors.ts`
2. **Typographie** : Modifiez `theme/typography.ts`
3. **Espacements** : Modifiez `theme/spacing.ts`
4. **Composants** : Modifiez les composants dans `components/`

## 📱 Screenshots

Ces exemples reproduisent les maquettes Figma avec :
- ✅ Couleurs exactes (#FF3EFF, #002A61, #803DFF)
- ✅ Dégradés (#002A61 → #FF3EFF)
- ✅ Typographie cohérente (Bold pour titres, Inter pour texte)
- ✅ Spacing et layout selon le design system

## 🔗 Liens Utiles

- [Guide de Démarrage Rapide](../QUICK_START.md)
- [Documentation du Theme](../theme/README.md)
- [Composants Disponibles](../components/)

## ⚡ Prochaines Étapes

1. Testez les exemples dans votre app
2. Adaptez-les à vos besoins spécifiques
3. Créez de nouveaux écrans en suivant les patterns
4. Ajoutez vos propres composants au design system si nécessaire
