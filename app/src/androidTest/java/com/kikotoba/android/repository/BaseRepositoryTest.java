package com.kikotoba.android.repository;

import android.support.test.runner.AndroidJUnit4;

import com.kikotoba.android.WaitUtil;

import org.junit.runner.RunWith;

/**
 * Instrumentation test, which will execute on an Android device.
 *
 * @see <a href="http://d.android.com/tools/testing">Testing documentation</a>
 */
@RunWith(AndroidJUnit4.class)
public class BaseRepositoryTest {
    protected static final String UID = "CEPSTWjTNQXfGBLTT3gSTnmy2hu2";

    protected WaitUtil waitUtil = new WaitUtil();

}
