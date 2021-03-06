package com.kikotoba.android.repository;

import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;

import com.kikotoba.android.util.FirebaseUtil;

import java.util.List;

/**
 * Created by raix on 2017/03/25.
 */

public class BaseRepository {

    protected FirebaseDatabase firebaseDatabase;

    protected BaseRepository() {
        firebaseDatabase = FirebaseUtil.getFirebaseDatabase();
    }

    public interface EntityListEventListener<T> {
        void onSuccess(List<T> entities);
        void onError(DatabaseError error);
    }

    public interface EntityEventListener<T> {
        void onSuccess(T entity);
        void onError(DatabaseError error);
    }

}
