package com.kikotoba.android.repository;

import android.support.annotation.NonNull;
import android.support.test.runner.AndroidJUnit4;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DatabaseError;
import com.kikotoba.android.WaitUtil;
import com.kikotoba.android.model.entity.user.UserLogByArticle;

import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertTrue;

/**
 * Instrumentation test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class UserLogByArticleRepositoryTest extends BaseRepositoryTest {

    private UserLogByArticle userLog = null;


    @Test
    public void useAppFirebase() throws Exception {
        final WaitUtil waitUtil = new WaitUtil();

        // 作成
        UserLogByArticle log = new UserLogByArticle();
        Map<String, Boolean> speaking = new HashMap();
        speaking.put("2", true);
        speaking.put("4", true);

        UserLogRepository repo = new UserLogRepository();
        String articleId = "voa_001";
        Task task = repo.setUserLogByArticle(UID, articleId, log);
        task.addOnCompleteListener(new OnCompleteListener() {
            @Override
            public void onComplete(@NonNull Task task) {
                if (task.getException() != null) {
                    task.getException().printStackTrace();
                }
            }
        });

        // 取得
        repo.getUserLogByArticle(UID, articleId, new BaseRepository.EntityEventListener<UserLogByArticle>() {
            @Override
            public void onSuccess(UserLogByArticle entity) {
                userLog = entity;
                waitUtil.hasDone();
            }

            @Override
            public void onError(DatabaseError error) {
                assertTrue(false);
            }
        });
        waitUtil.waitForDone();
        assertTrue(waitUtil.isDone());
    }
}
