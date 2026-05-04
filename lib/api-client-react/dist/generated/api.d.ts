import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ConnexionRequete, CreerEnseignantRequete, CreerHeureRequete, CreerMatiereRequete, CreerUtilisateurRequete, Enseignant, ErreurReponse, HealthStatus, Heure, ListerHeuresParams, Matiere, ModifierEnseignantRequete, ModifierHeureRequete, ModifierMatiereRequete, ModifierParametresRequete, ModifierUtilisateurRequete, Parametres, RecapitulatifEnseignant, StatistiqueDepartement, StatistiqueFiliere, StatistiqueMensuelle, TableauBordAdmin, TableauBordRh, Utilisateur, ValiderHeureRequete } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Connexion (Admin / RH / Enseignant)
 */
export declare const getConnecterUrl: () => string;
export declare const connecter: (connexionRequete: ConnexionRequete, options?: RequestInit) => Promise<Utilisateur>;
export declare const getConnecterMutationOptions: <TError = ErrorType<ErreurReponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof connecter>>, TError, {
        data: BodyType<ConnexionRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof connecter>>, TError, {
    data: BodyType<ConnexionRequete>;
}, TContext>;
export type ConnecterMutationResult = NonNullable<Awaited<ReturnType<typeof connecter>>>;
export type ConnecterMutationBody = BodyType<ConnexionRequete>;
export type ConnecterMutationError = ErrorType<ErreurReponse>;
/**
 * @summary Connexion (Admin / RH / Enseignant)
 */
export declare const useConnecter: <TError = ErrorType<ErreurReponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof connecter>>, TError, {
        data: BodyType<ConnexionRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof connecter>>, TError, {
    data: BodyType<ConnexionRequete>;
}, TContext>;
/**
 * @summary Déconnexion
 */
export declare const getDeconnecterUrl: () => string;
export declare const deconnecter: (options?: RequestInit) => Promise<void>;
export declare const getDeconnecterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deconnecter>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deconnecter>>, TError, void, TContext>;
export type DeconnecterMutationResult = NonNullable<Awaited<ReturnType<typeof deconnecter>>>;
export type DeconnecterMutationError = ErrorType<unknown>;
/**
 * @summary Déconnexion
 */
export declare const useDeconnecter: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deconnecter>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deconnecter>>, TError, void, TContext>;
/**
 * @summary Récupère l'utilisateur courant
 */
export declare const getObtenirUtilisateurCourantUrl: () => string;
export declare const obtenirUtilisateurCourant: (options?: RequestInit) => Promise<Utilisateur>;
export declare const getObtenirUtilisateurCourantQueryKey: () => readonly ["/api/auth/moi"];
export declare const getObtenirUtilisateurCourantQueryOptions: <TData = Awaited<ReturnType<typeof obtenirUtilisateurCourant>>, TError = ErrorType<ErreurReponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirUtilisateurCourant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirUtilisateurCourant>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirUtilisateurCourantQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirUtilisateurCourant>>>;
export type ObtenirUtilisateurCourantQueryError = ErrorType<ErreurReponse>;
/**
 * @summary Récupère l'utilisateur courant
 */
export declare function useObtenirUtilisateurCourant<TData = Awaited<ReturnType<typeof obtenirUtilisateurCourant>>, TError = ErrorType<ErreurReponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirUtilisateurCourant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Liste tous les utilisateurs (Admin)
 */
export declare const getListerUtilisateursUrl: () => string;
export declare const listerUtilisateurs: (options?: RequestInit) => Promise<Utilisateur[]>;
export declare const getListerUtilisateursQueryKey: () => readonly ["/api/utilisateurs"];
export declare const getListerUtilisateursQueryOptions: <TData = Awaited<ReturnType<typeof listerUtilisateurs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerUtilisateurs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listerUtilisateurs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListerUtilisateursQueryResult = NonNullable<Awaited<ReturnType<typeof listerUtilisateurs>>>;
export type ListerUtilisateursQueryError = ErrorType<unknown>;
/**
 * @summary Liste tous les utilisateurs (Admin)
 */
export declare function useListerUtilisateurs<TData = Awaited<ReturnType<typeof listerUtilisateurs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerUtilisateurs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Crée un compte utilisateur (Admin)
 */
export declare const getCreerUtilisateurUrl: () => string;
export declare const creerUtilisateur: (creerUtilisateurRequete: CreerUtilisateurRequete, options?: RequestInit) => Promise<Utilisateur>;
export declare const getCreerUtilisateurMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerUtilisateur>>, TError, {
        data: BodyType<CreerUtilisateurRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof creerUtilisateur>>, TError, {
    data: BodyType<CreerUtilisateurRequete>;
}, TContext>;
export type CreerUtilisateurMutationResult = NonNullable<Awaited<ReturnType<typeof creerUtilisateur>>>;
export type CreerUtilisateurMutationBody = BodyType<CreerUtilisateurRequete>;
export type CreerUtilisateurMutationError = ErrorType<unknown>;
/**
 * @summary Crée un compte utilisateur (Admin)
 */
export declare const useCreerUtilisateur: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerUtilisateur>>, TError, {
        data: BodyType<CreerUtilisateurRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof creerUtilisateur>>, TError, {
    data: BodyType<CreerUtilisateurRequete>;
}, TContext>;
/**
 * @summary Modifie un utilisateur
 */
export declare const getModifierUtilisateurUrl: (id: number) => string;
export declare const modifierUtilisateur: (id: number, modifierUtilisateurRequete: ModifierUtilisateurRequete, options?: RequestInit) => Promise<Utilisateur>;
export declare const getModifierUtilisateurMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierUtilisateur>>, TError, {
        id: number;
        data: BodyType<ModifierUtilisateurRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof modifierUtilisateur>>, TError, {
    id: number;
    data: BodyType<ModifierUtilisateurRequete>;
}, TContext>;
export type ModifierUtilisateurMutationResult = NonNullable<Awaited<ReturnType<typeof modifierUtilisateur>>>;
export type ModifierUtilisateurMutationBody = BodyType<ModifierUtilisateurRequete>;
export type ModifierUtilisateurMutationError = ErrorType<unknown>;
/**
 * @summary Modifie un utilisateur
 */
export declare const useModifierUtilisateur: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierUtilisateur>>, TError, {
        id: number;
        data: BodyType<ModifierUtilisateurRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof modifierUtilisateur>>, TError, {
    id: number;
    data: BodyType<ModifierUtilisateurRequete>;
}, TContext>;
/**
 * @summary Supprime un utilisateur
 */
export declare const getSupprimerUtilisateurUrl: (id: number) => string;
export declare const supprimerUtilisateur: (id: number, options?: RequestInit) => Promise<void>;
export declare const getSupprimerUtilisateurMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerUtilisateur>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof supprimerUtilisateur>>, TError, {
    id: number;
}, TContext>;
export type SupprimerUtilisateurMutationResult = NonNullable<Awaited<ReturnType<typeof supprimerUtilisateur>>>;
export type SupprimerUtilisateurMutationError = ErrorType<unknown>;
/**
 * @summary Supprime un utilisateur
 */
export declare const useSupprimerUtilisateur: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerUtilisateur>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof supprimerUtilisateur>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Récupère les paramètres académiques et financiers
 */
export declare const getObtenirParametresUrl: () => string;
export declare const obtenirParametres: (options?: RequestInit) => Promise<Parametres>;
export declare const getObtenirParametresQueryKey: () => readonly ["/api/parametres"];
export declare const getObtenirParametresQueryOptions: <TData = Awaited<ReturnType<typeof obtenirParametres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirParametres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirParametres>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirParametresQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirParametres>>>;
export type ObtenirParametresQueryError = ErrorType<unknown>;
/**
 * @summary Récupère les paramètres académiques et financiers
 */
export declare function useObtenirParametres<TData = Awaited<ReturnType<typeof obtenirParametres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirParametres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Modifie les paramètres
 */
export declare const getModifierParametresUrl: () => string;
export declare const modifierParametres: (modifierParametresRequete: ModifierParametresRequete, options?: RequestInit) => Promise<Parametres>;
export declare const getModifierParametresMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierParametres>>, TError, {
        data: BodyType<ModifierParametresRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof modifierParametres>>, TError, {
    data: BodyType<ModifierParametresRequete>;
}, TContext>;
export type ModifierParametresMutationResult = NonNullable<Awaited<ReturnType<typeof modifierParametres>>>;
export type ModifierParametresMutationBody = BodyType<ModifierParametresRequete>;
export type ModifierParametresMutationError = ErrorType<unknown>;
/**
 * @summary Modifie les paramètres
 */
export declare const useModifierParametres: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierParametres>>, TError, {
        data: BodyType<ModifierParametresRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof modifierParametres>>, TError, {
    data: BodyType<ModifierParametresRequete>;
}, TContext>;
/**
 * @summary Liste tous les enseignants
 */
export declare const getListerEnseignantsUrl: () => string;
export declare const listerEnseignants: (options?: RequestInit) => Promise<Enseignant[]>;
export declare const getListerEnseignantsQueryKey: () => readonly ["/api/enseignants"];
export declare const getListerEnseignantsQueryOptions: <TData = Awaited<ReturnType<typeof listerEnseignants>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerEnseignants>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listerEnseignants>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListerEnseignantsQueryResult = NonNullable<Awaited<ReturnType<typeof listerEnseignants>>>;
export type ListerEnseignantsQueryError = ErrorType<unknown>;
/**
 * @summary Liste tous les enseignants
 */
export declare function useListerEnseignants<TData = Awaited<ReturnType<typeof listerEnseignants>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerEnseignants>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Crée un enseignant
 */
export declare const getCreerEnseignantUrl: () => string;
export declare const creerEnseignant: (creerEnseignantRequete: CreerEnseignantRequete, options?: RequestInit) => Promise<Enseignant>;
export declare const getCreerEnseignantMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerEnseignant>>, TError, {
        data: BodyType<CreerEnseignantRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof creerEnseignant>>, TError, {
    data: BodyType<CreerEnseignantRequete>;
}, TContext>;
export type CreerEnseignantMutationResult = NonNullable<Awaited<ReturnType<typeof creerEnseignant>>>;
export type CreerEnseignantMutationBody = BodyType<CreerEnseignantRequete>;
export type CreerEnseignantMutationError = ErrorType<unknown>;
/**
 * @summary Crée un enseignant
 */
export declare const useCreerEnseignant: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerEnseignant>>, TError, {
        data: BodyType<CreerEnseignantRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof creerEnseignant>>, TError, {
    data: BodyType<CreerEnseignantRequete>;
}, TContext>;
/**
 * @summary Récupère un enseignant
 */
export declare const getObtenirEnseignantUrl: (id: number) => string;
export declare const obtenirEnseignant: (id: number, options?: RequestInit) => Promise<Enseignant>;
export declare const getObtenirEnseignantQueryKey: (id: number) => readonly [`/api/enseignants/${number}`];
export declare const getObtenirEnseignantQueryOptions: <TData = Awaited<ReturnType<typeof obtenirEnseignant>>, TError = ErrorType<ErreurReponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignant>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirEnseignantQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirEnseignant>>>;
export type ObtenirEnseignantQueryError = ErrorType<ErreurReponse>;
/**
 * @summary Récupère un enseignant
 */
export declare function useObtenirEnseignant<TData = Awaited<ReturnType<typeof obtenirEnseignant>>, TError = ErrorType<ErreurReponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Modifie un enseignant
 */
export declare const getModifierEnseignantUrl: (id: number) => string;
export declare const modifierEnseignant: (id: number, modifierEnseignantRequete: ModifierEnseignantRequete, options?: RequestInit) => Promise<Enseignant>;
export declare const getModifierEnseignantMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierEnseignant>>, TError, {
        id: number;
        data: BodyType<ModifierEnseignantRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof modifierEnseignant>>, TError, {
    id: number;
    data: BodyType<ModifierEnseignantRequete>;
}, TContext>;
export type ModifierEnseignantMutationResult = NonNullable<Awaited<ReturnType<typeof modifierEnseignant>>>;
export type ModifierEnseignantMutationBody = BodyType<ModifierEnseignantRequete>;
export type ModifierEnseignantMutationError = ErrorType<unknown>;
/**
 * @summary Modifie un enseignant
 */
export declare const useModifierEnseignant: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierEnseignant>>, TError, {
        id: number;
        data: BodyType<ModifierEnseignantRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof modifierEnseignant>>, TError, {
    id: number;
    data: BodyType<ModifierEnseignantRequete>;
}, TContext>;
/**
 * @summary Supprime un enseignant
 */
export declare const getSupprimerEnseignantUrl: (id: number) => string;
export declare const supprimerEnseignant: (id: number, options?: RequestInit) => Promise<void>;
export declare const getSupprimerEnseignantMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerEnseignant>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof supprimerEnseignant>>, TError, {
    id: number;
}, TContext>;
export type SupprimerEnseignantMutationResult = NonNullable<Awaited<ReturnType<typeof supprimerEnseignant>>>;
export type SupprimerEnseignantMutationError = ErrorType<unknown>;
/**
 * @summary Supprime un enseignant
 */
export declare const useSupprimerEnseignant: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerEnseignant>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof supprimerEnseignant>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Récapitulatif complet (heures, montants) d'un enseignant
 */
export declare const getObtenirRecapitulatifEnseignantUrl: (id: number) => string;
export declare const obtenirRecapitulatifEnseignant: (id: number, options?: RequestInit) => Promise<RecapitulatifEnseignant>;
export declare const getObtenirRecapitulatifEnseignantQueryKey: (id: number) => readonly [`/api/enseignants/${number}/recapitulatif`];
export declare const getObtenirRecapitulatifEnseignantQueryOptions: <TData = Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirRecapitulatifEnseignantQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>>;
export type ObtenirRecapitulatifEnseignantQueryError = ErrorType<unknown>;
/**
 * @summary Récapitulatif complet (heures, montants) d'un enseignant
 */
export declare function useObtenirRecapitulatifEnseignant<TData = Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirRecapitulatifEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Liste toutes les matières
 */
export declare const getListerMatieresUrl: () => string;
export declare const listerMatieres: (options?: RequestInit) => Promise<Matiere[]>;
export declare const getListerMatieresQueryKey: () => readonly ["/api/matieres"];
export declare const getListerMatieresQueryOptions: <TData = Awaited<ReturnType<typeof listerMatieres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerMatieres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listerMatieres>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListerMatieresQueryResult = NonNullable<Awaited<ReturnType<typeof listerMatieres>>>;
export type ListerMatieresQueryError = ErrorType<unknown>;
/**
 * @summary Liste toutes les matières
 */
export declare function useListerMatieres<TData = Awaited<ReturnType<typeof listerMatieres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerMatieres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Crée une matière
 */
export declare const getCreerMatiereUrl: () => string;
export declare const creerMatiere: (creerMatiereRequete: CreerMatiereRequete, options?: RequestInit) => Promise<Matiere>;
export declare const getCreerMatiereMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerMatiere>>, TError, {
        data: BodyType<CreerMatiereRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof creerMatiere>>, TError, {
    data: BodyType<CreerMatiereRequete>;
}, TContext>;
export type CreerMatiereMutationResult = NonNullable<Awaited<ReturnType<typeof creerMatiere>>>;
export type CreerMatiereMutationBody = BodyType<CreerMatiereRequete>;
export type CreerMatiereMutationError = ErrorType<unknown>;
/**
 * @summary Crée une matière
 */
export declare const useCreerMatiere: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerMatiere>>, TError, {
        data: BodyType<CreerMatiereRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof creerMatiere>>, TError, {
    data: BodyType<CreerMatiereRequete>;
}, TContext>;
/**
 * @summary Modifie une matière
 */
export declare const getModifierMatiereUrl: (id: number) => string;
export declare const modifierMatiere: (id: number, modifierMatiereRequete: ModifierMatiereRequete, options?: RequestInit) => Promise<Matiere>;
export declare const getModifierMatiereMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierMatiere>>, TError, {
        id: number;
        data: BodyType<ModifierMatiereRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof modifierMatiere>>, TError, {
    id: number;
    data: BodyType<ModifierMatiereRequete>;
}, TContext>;
export type ModifierMatiereMutationResult = NonNullable<Awaited<ReturnType<typeof modifierMatiere>>>;
export type ModifierMatiereMutationBody = BodyType<ModifierMatiereRequete>;
export type ModifierMatiereMutationError = ErrorType<unknown>;
/**
 * @summary Modifie une matière
 */
export declare const useModifierMatiere: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierMatiere>>, TError, {
        id: number;
        data: BodyType<ModifierMatiereRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof modifierMatiere>>, TError, {
    id: number;
    data: BodyType<ModifierMatiereRequete>;
}, TContext>;
/**
 * @summary Supprime une matière
 */
export declare const getSupprimerMatiereUrl: (id: number) => string;
export declare const supprimerMatiere: (id: number, options?: RequestInit) => Promise<void>;
export declare const getSupprimerMatiereMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerMatiere>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof supprimerMatiere>>, TError, {
    id: number;
}, TContext>;
export type SupprimerMatiereMutationResult = NonNullable<Awaited<ReturnType<typeof supprimerMatiere>>>;
export type SupprimerMatiereMutationError = ErrorType<unknown>;
/**
 * @summary Supprime une matière
 */
export declare const useSupprimerMatiere: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerMatiere>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof supprimerMatiere>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Liste les heures (filtrable par enseignant)
 */
export declare const getListerHeuresUrl: (params?: ListerHeuresParams) => string;
export declare const listerHeures: (params?: ListerHeuresParams, options?: RequestInit) => Promise<Heure[]>;
export declare const getListerHeuresQueryKey: (params?: ListerHeuresParams) => readonly ["/api/heures", ...ListerHeuresParams[]];
export declare const getListerHeuresQueryOptions: <TData = Awaited<ReturnType<typeof listerHeures>>, TError = ErrorType<unknown>>(params?: ListerHeuresParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerHeures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listerHeures>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListerHeuresQueryResult = NonNullable<Awaited<ReturnType<typeof listerHeures>>>;
export type ListerHeuresQueryError = ErrorType<unknown>;
/**
 * @summary Liste les heures (filtrable par enseignant)
 */
export declare function useListerHeures<TData = Awaited<ReturnType<typeof listerHeures>>, TError = ErrorType<unknown>>(params?: ListerHeuresParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listerHeures>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Saisit une nouvelle heure
 */
export declare const getCreerHeureUrl: () => string;
export declare const creerHeure: (creerHeureRequete: CreerHeureRequete, options?: RequestInit) => Promise<Heure>;
export declare const getCreerHeureMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerHeure>>, TError, {
        data: BodyType<CreerHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof creerHeure>>, TError, {
    data: BodyType<CreerHeureRequete>;
}, TContext>;
export type CreerHeureMutationResult = NonNullable<Awaited<ReturnType<typeof creerHeure>>>;
export type CreerHeureMutationBody = BodyType<CreerHeureRequete>;
export type CreerHeureMutationError = ErrorType<unknown>;
/**
 * @summary Saisit une nouvelle heure
 */
export declare const useCreerHeure: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof creerHeure>>, TError, {
        data: BodyType<CreerHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof creerHeure>>, TError, {
    data: BodyType<CreerHeureRequete>;
}, TContext>;
/**
 * @summary Modifie une heure
 */
export declare const getModifierHeureUrl: (id: number) => string;
export declare const modifierHeure: (id: number, modifierHeureRequete: ModifierHeureRequete, options?: RequestInit) => Promise<Heure>;
export declare const getModifierHeureMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierHeure>>, TError, {
        id: number;
        data: BodyType<ModifierHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof modifierHeure>>, TError, {
    id: number;
    data: BodyType<ModifierHeureRequete>;
}, TContext>;
export type ModifierHeureMutationResult = NonNullable<Awaited<ReturnType<typeof modifierHeure>>>;
export type ModifierHeureMutationBody = BodyType<ModifierHeureRequete>;
export type ModifierHeureMutationError = ErrorType<unknown>;
/**
 * @summary Modifie une heure
 */
export declare const useModifierHeure: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof modifierHeure>>, TError, {
        id: number;
        data: BodyType<ModifierHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof modifierHeure>>, TError, {
    id: number;
    data: BodyType<ModifierHeureRequete>;
}, TContext>;
/**
 * @summary Supprime une heure
 */
export declare const getSupprimerHeureUrl: (id: number) => string;
export declare const supprimerHeure: (id: number, options?: RequestInit) => Promise<void>;
export declare const getSupprimerHeureMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerHeure>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof supprimerHeure>>, TError, {
    id: number;
}, TContext>;
export type SupprimerHeureMutationResult = NonNullable<Awaited<ReturnType<typeof supprimerHeure>>>;
export type SupprimerHeureMutationError = ErrorType<unknown>;
/**
 * @summary Supprime une heure
 */
export declare const useSupprimerHeure: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof supprimerHeure>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof supprimerHeure>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Valide ou invalide une heure (RH)
 */
export declare const getValiderHeureUrl: (id: number) => string;
export declare const validerHeure: (id: number, validerHeureRequete: ValiderHeureRequete, options?: RequestInit) => Promise<Heure>;
export declare const getValiderHeureMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof validerHeure>>, TError, {
        id: number;
        data: BodyType<ValiderHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof validerHeure>>, TError, {
    id: number;
    data: BodyType<ValiderHeureRequete>;
}, TContext>;
export type ValiderHeureMutationResult = NonNullable<Awaited<ReturnType<typeof validerHeure>>>;
export type ValiderHeureMutationBody = BodyType<ValiderHeureRequete>;
export type ValiderHeureMutationError = ErrorType<unknown>;
/**
 * @summary Valide ou invalide une heure (RH)
 */
export declare const useValiderHeure: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof validerHeure>>, TError, {
        id: number;
        data: BodyType<ValiderHeureRequete>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof validerHeure>>, TError, {
    id: number;
    data: BodyType<ValiderHeureRequete>;
}, TContext>;
/**
 * @summary Tableau de bord administrateur
 */
export declare const getObtenirTableauBordAdminUrl: () => string;
export declare const obtenirTableauBordAdmin: (options?: RequestInit) => Promise<TableauBordAdmin>;
export declare const getObtenirTableauBordAdminQueryKey: () => readonly ["/api/tableau-bord/admin"];
export declare const getObtenirTableauBordAdminQueryOptions: <TData = Awaited<ReturnType<typeof obtenirTableauBordAdmin>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordAdmin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordAdmin>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirTableauBordAdminQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirTableauBordAdmin>>>;
export type ObtenirTableauBordAdminQueryError = ErrorType<unknown>;
/**
 * @summary Tableau de bord administrateur
 */
export declare function useObtenirTableauBordAdmin<TData = Awaited<ReturnType<typeof obtenirTableauBordAdmin>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordAdmin>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Tableau de bord ressources humaines
 */
export declare const getObtenirTableauBordRhUrl: () => string;
export declare const obtenirTableauBordRh: (options?: RequestInit) => Promise<TableauBordRh>;
export declare const getObtenirTableauBordRhQueryKey: () => readonly ["/api/tableau-bord/rh"];
export declare const getObtenirTableauBordRhQueryOptions: <TData = Awaited<ReturnType<typeof obtenirTableauBordRh>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordRh>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordRh>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirTableauBordRhQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirTableauBordRh>>>;
export type ObtenirTableauBordRhQueryError = ErrorType<unknown>;
/**
 * @summary Tableau de bord ressources humaines
 */
export declare function useObtenirTableauBordRh<TData = Awaited<ReturnType<typeof obtenirTableauBordRh>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordRh>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Tableau de bord pour l'enseignant courant
 */
export declare const getObtenirTableauBordEnseignantUrl: () => string;
export declare const obtenirTableauBordEnseignant: (options?: RequestInit) => Promise<RecapitulatifEnseignant>;
export declare const getObtenirTableauBordEnseignantQueryKey: () => readonly ["/api/tableau-bord/enseignant"];
export declare const getObtenirTableauBordEnseignantQueryOptions: <TData = Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirTableauBordEnseignantQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>>;
export type ObtenirTableauBordEnseignantQueryError = ErrorType<unknown>;
/**
 * @summary Tableau de bord pour l'enseignant courant
 */
export declare function useObtenirTableauBordEnseignant<TData = Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirTableauBordEnseignant>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Heures totales par département
 */
export declare const getObtenirStatistiquesDepartementsUrl: () => string;
export declare const obtenirStatistiquesDepartements: (options?: RequestInit) => Promise<StatistiqueDepartement[]>;
export declare const getObtenirStatistiquesDepartementsQueryKey: () => readonly ["/api/statistiques/departements"];
export declare const getObtenirStatistiquesDepartementsQueryOptions: <TData = Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirStatistiquesDepartementsQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>>;
export type ObtenirStatistiquesDepartementsQueryError = ErrorType<unknown>;
/**
 * @summary Heures totales par département
 */
export declare function useObtenirStatistiquesDepartements<TData = Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesDepartements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Liste des enseignants en dépassement d'heures
 */
export declare const getObtenirEnseignantsEnDepassementUrl: () => string;
export declare const obtenirEnseignantsEnDepassement: (options?: RequestInit) => Promise<RecapitulatifEnseignant[]>;
export declare const getObtenirEnseignantsEnDepassementQueryKey: () => readonly ["/api/statistiques/depassements"];
export declare const getObtenirEnseignantsEnDepassementQueryOptions: <TData = Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirEnseignantsEnDepassementQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>>;
export type ObtenirEnseignantsEnDepassementQueryError = ErrorType<unknown>;
/**
 * @summary Liste des enseignants en dépassement d'heures
 */
export declare function useObtenirEnseignantsEnDepassement<TData = Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirEnseignantsEnDepassement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Répartition des heures par filière
 */
export declare const getObtenirStatistiquesFilieresUrl: () => string;
export declare const obtenirStatistiquesFilieres: (options?: RequestInit) => Promise<StatistiqueFiliere[]>;
export declare const getObtenirStatistiquesFilieresQueryKey: () => readonly ["/api/statistiques/filieres"];
export declare const getObtenirStatistiquesFilieresQueryOptions: <TData = Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirStatistiquesFilieresQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>>;
export type ObtenirStatistiquesFilieresQueryError = ErrorType<unknown>;
/**
 * @summary Répartition des heures par filière
 */
export declare function useObtenirStatistiquesFilieres<TData = Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesFilieres>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Statistiques mensuelles (12 derniers mois)
 */
export declare const getObtenirStatistiquesMensuellesUrl: () => string;
export declare const obtenirStatistiquesMensuelles: (options?: RequestInit) => Promise<StatistiqueMensuelle[]>;
export declare const getObtenirStatistiquesMensuellesQueryKey: () => readonly ["/api/statistiques/mensuel"];
export declare const getObtenirStatistiquesMensuellesQueryOptions: <TData = Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ObtenirStatistiquesMensuellesQueryResult = NonNullable<Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>>;
export type ObtenirStatistiquesMensuellesQueryError = ErrorType<unknown>;
/**
 * @summary Statistiques mensuelles (12 derniers mois)
 */
export declare function useObtenirStatistiquesMensuelles<TData = Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof obtenirStatistiquesMensuelles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map