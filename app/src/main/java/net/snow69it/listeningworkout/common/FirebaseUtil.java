package net.snow69it.listeningworkout.common;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import net.snow69it.listeningworkout.article.Article;

/**
 * Created by raix on 2017/03/12.
 */

public class FirebaseUtil {

    private static FirebaseDatabase firebaseDatabase;
    public static synchronized FirebaseDatabase getFirebaseDatabase() {
        if (firebaseDatabase == null) {
            firebaseDatabase = FirebaseDatabase.getInstance();
            firebaseDatabase.setPersistenceEnabled(true);
        }
        return firebaseDatabase;
    }

    public static DatabaseReference getDatabaseReference() {
        return FirebaseDatabase.getInstance().getReference();
    }

    public static StorageReference getStorageReference(Article article) {
        FirebaseStorage storage = FirebaseStorage.getInstance();
        StorageReference storageRef = storage.getReferenceFromUrl("gs://listeningworkout.appspot.com/");
        StorageReference pathReference = storageRef.child(getAudioPath(article));
        return pathReference;
    }

    private static String getAudioPath(Article article) {
        return String.format("article/%s/%s.mp3", article.getId(), article.getLanguage());
    }
}
