---
titre: "Introduction aux probabilités"
statut: brouillon          # brouillon | verifie
genere_avec_ia: true
verifie_par: ""
date_verification:
---

> **Exemple de structure.** Ce chapitre est un brouillon d'illustration, non vérifié : il n'apparaît pas en production. Remplace-le par ton propre contenu.

## Expérience, univers, événement

Une **expérience aléatoire** est une expérience dont le résultat ne peut pas être prédit avec certitude. L'ensemble de tous ses résultats possibles est l'**univers** $\Omega$. Un **événement** est un sous-ensemble de $\Omega$.

Exemple : on lance un dé à six faces. $\Omega = \{1,2,3,4,5,6\}$ et l'événement « obtenir un nombre pair » est $A = \{2,4,6\}$.

## Probabilité d'un événement

Quand tous les résultats sont équiprobables :

$$P(A) = \frac{\text{nombre de cas favorables}}{\text{nombre de cas possibles}}$$

Ici, $P(A) = \frac{3}{6} = 0{,}5$.

## Règles de calcul

| Règle | Formule |
| --- | --- |
| Complémentaire | $P(\bar A) = 1 - P(A)$ |
| Union | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| Indépendance | $P(A \cap B) = P(A)\,P(B)$ |

## Probabilité conditionnelle

La probabilité de $A$ sachant que $B$ s'est réalisé est

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0.$$
